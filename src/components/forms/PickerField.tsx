import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useColors } from '@/context/ThemeContext';
import type { ID } from '@/models/common';
import { describeCity, getAirport, getTrip } from '@/services/data/lookup';
import { flagEmoji } from '@/services/util/text';
import { formatDateRange } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';
import { SearchPickerSheet, type PickerItem } from '../modals/SearchPickerSheet';
import { FormField } from './FormField';

interface PickerShellProps {
  label: string;
  displayValue: string | null;
  placeholder: string;
  required?: boolean;
  onOpen: () => void;
  hint?: string;
}

function PickerShell({ label, displayValue, placeholder, required, onOpen, hint }: PickerShellProps) {
  const colors = useColors();
  return (
    <FormField label={label} required={required} hint={hint}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${displayValue ?? placeholder}`}
        style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <AppText style={{ flex: 1 }} tone={displayValue ? 'default' : 'muted'} numberOfLines={1}>
          {displayValue ?? placeholder}
        </AppText>
        <Icon name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
    </FormField>
  );
}

interface CityFieldProps {
  value: ID | null;
  onChange: (cityId: ID) => void;
  label?: string;
  required?: boolean;
}

/** Searchable city picker (reference data: permanent locations, not visits). */
export function CityField({ value, onChange, label = 'City', required }: CityFieldProps) {
  const { db } = useData();
  const [open, setOpen] = useState(false);
  const items = useMemo<PickerItem[]>(
    () =>
      db.cities
        .map((city) => {
          const d = describeCity(db, city.id);
          return { id: city.id, title: city.name, subtitle: d.countryName, leading: flagEmoji(d.isoCode) };
        })
        .sort((a, b) => a.title.localeCompare(b.title)),
    [db],
  );

  return (
    <>
      <PickerShell
        label={label}
        required={required}
        placeholder="Choose a city"
        displayValue={value ? describeCity(db, value).text : null}
        onOpen={() => setOpen(true)}
      />
      <SearchPickerSheet
        visible={open}
        title={label}
        placeholder="Search city or country"
        items={items}
        selectedId={value}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          onChange(item.id);
          setOpen(false);
        }}
      />
    </>
  );
}

interface AirportFieldProps {
  label: string;
  value: ID | null;
  onChange: (airportId: ID) => void;
  required?: boolean;
}

/** Airport search by name or IATA code (spec section 17). */
export function AirportField({ label, value, onChange, required }: AirportFieldProps) {
  const { db } = useData();
  const [open, setOpen] = useState(false);
  const items = useMemo<PickerItem[]>(
    () =>
      db.airports
        .map((airport) => ({
          id: airport.id,
          title: `${airport.iata_code} · ${airport.name}`,
          subtitle: describeCity(db, airport.city_id).text,
          keywords: `${airport.iata_code} ${airport.icao_code}`,
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [db],
  );
  const airport = getAirport(db, value);

  return (
    <>
      <PickerShell
        label={label}
        required={required}
        placeholder="Search airport or IATA code"
        displayValue={airport ? `${airport.iata_code} · ${airport.name}` : null}
        onOpen={() => setOpen(true)}
      />
      <SearchPickerSheet
        visible={open}
        title={label}
        placeholder="Airport name or IATA code (e.g. CPH)"
        items={items}
        selectedId={value}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          onChange(item.id);
          setOpen(false);
        }}
      />
    </>
  );
}

interface TripFieldProps {
  value: ID | null;
  onChange: (tripId: ID | null) => void;
}

/** Optional trip association. Only the signed-in user's own trips are offered. */
export function TripField({ value, onChange }: TripFieldProps) {
  const { db, currentUserId } = useData();
  const [open, setOpen] = useState(false);
  const items = useMemo<PickerItem[]>(
    () => [
      { id: '__none__', title: 'No trip', subtitle: 'Keep it as a standalone entry' },
      ...db.trips
        .filter((t) => t.user_id === currentUserId)
        .sort((a, b) => b.start_date.localeCompare(a.start_date))
        .map((t) => ({ id: t.id, title: t.title, subtitle: formatDateRange(t.start_date, t.end_date) })),
    ],
    [db.trips, currentUserId],
  );
  const trip = getTrip(db, value);

  return (
    <>
      <PickerShell
        label="Trip"
        placeholder="No trip"
        displayValue={trip?.title ?? null}
        onOpen={() => setOpen(true)}
      />
      <SearchPickerSheet
        visible={open}
        title="Trip"
        placeholder="Search your trips"
        items={items}
        selectedId={value ?? '__none__'}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          onChange(item.id === '__none__' ? null : item.id);
          setOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: MIN_TOUCH + 4,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
