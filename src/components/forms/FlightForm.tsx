import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useColors } from '@/context/ThemeContext';
import { useActions } from '@/context/useActions';
import { useUnit } from '@/context/useTravelData';
import type { ID, Visibility } from '@/models/common';
import { getAirport, getTrip } from '@/services/data/lookup';
import { distanceBetweenAirportsKm } from '@/services/data/flightService';
import { formatDistance } from '@/services/geo/distance';
import { formatTime, todayIso, toISODate } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';
import { confirmDestructive } from '../modals/confirm';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { AirportField, TripField } from './PickerField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

const toIso = (date: string, time: string): string => new Date(`${date}T${time || '00:00'}:00`).toISOString();

interface FlightFormProps {
  id?: string;
  tripId?: string;
}

/**
 * Add / edit a flight. The distance is never typed in: it is calculated from
 * the airport coordinates with the Haversine formula and shown live.
 */
export function FlightForm({ id, tripId }: FlightFormProps) {
  const router = useRouter();
  const colors = useColors();
  const unit = useUnit();
  const { db } = useData();
  const actions = useActions();
  const existing = db.flights.find((f) => f.id === id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [from, setFrom] = useState<ID | null>(existing?.departure_airport_id ?? null);
  const [to, setTo] = useState<ID | null>(existing?.arrival_airport_id ?? null);
  const [depDate, setDepDate] = useState(existing ? toISODate(new Date(existing.departure_datetime)) : (presetTrip?.start_date ?? todayIso()));
  const [depTime, setDepTime] = useState(existing ? formatTime(existing.departure_datetime) : '09:00');
  const [arrDate, setArrDate] = useState(existing?.arrival_datetime ? toISODate(new Date(existing.arrival_datetime)) : '');
  const [arrTime, setArrTime] = useState(existing?.arrival_datetime ? formatTime(existing.arrival_datetime) : '');
  const [airline, setAirline] = useState(existing?.airline ?? '');
  const [number, setNumber] = useState(existing?.flight_number ?? '');
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  const distance = useMemo(() => {
    const a = getAirport(db, from);
    const b = getAirport(db, to);
    return a && b && a.id !== b.id ? distanceBetweenAirportsKm(a, b) : null;
  }, [db, from, to]);

  const save = () =>
    submit(() => {
      if (!from || !to) throw new Error('Choose both a departure and an arrival airport.');
      const input = {
        trip_id: trip,
        departure_airport_id: from,
        arrival_airport_id: to,
        departure_datetime: toIso(depDate, depTime),
        arrival_datetime: arrDate ? toIso(arrDate, arrTime || '12:00') : null,
        airline,
        flight_number: number,
        notes,
        visibility,
      };
      if (existing) actions.updateFlight(existing.id, input);
      else actions.createFlight(input);
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete flight', 'This flight will be removed from your statistics and globe.', 'Delete', () => {
      actions.deleteFlight(existing.id);
      router.back();
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit flight' : 'New flight'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete flight"
    >
      <AirportField label="From" required value={from} onChange={setFrom} />
      <AirportField label="To" required value={to} onChange={setTo} />

      <View style={[styles.distance, { backgroundColor: colors.tintBlue }]} accessibilityLiveRegion="polite">
        <Icon name="navigate" size={18} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <AppText variant="label" tone="primary">
            {distance !== null ? formatDistance(distance, unit) : 'Distance calculated automatically'}
          </AppText>
          <AppText variant="caption" tone="muted">
            Great-circle distance between the two airports (Haversine).
          </AppText>
        </View>
      </View>

      <DateTimeField label="Departure date" required value={depDate} onChange={setDepDate} />
      <DateTimeField label="Departure time" mode="time" value={depTime} onChange={setDepTime} />
      <DateTimeField label="Arrival date" value={arrDate} onChange={setArrDate} clearable />
      <DateTimeField label="Arrival time" mode="time" value={arrTime} onChange={setArrTime} />
      <TextField label="Airline" value={airline} onChangeText={setAirline} placeholder="SAS" />
      <TextField label="Flight number" value={number} onChangeText={setNumber} autoCapitalize="characters" placeholder="SK571" />
      <TripField value={trip} onChange={setTrip} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  distance: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radii.lg },
});
