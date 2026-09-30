import { useRouter } from 'expo-router';
import { useState } from 'react';
import { PLACE_TYPE_LABELS } from '@/constants/categories';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import type { ID, Visibility } from '@/models/common';
import { PLACE_TYPES, type PlaceType } from '@/models/place';
import { getCity, getTrip } from '@/services/data/lookup';
import { jitterCoordinate } from '@/services/geo/jitter';
import { todayIso } from '@/services/util/dates';
import { confirmDestructive } from '../modals/confirm';
import { ChipSelect } from './ChipSelect';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { CityField, TripField } from './PickerField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

/** Landmarks, restaurants, beaches, museums... */
export function PlaceForm({ id, tripId }: { id?: string; tripId?: string }) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = db.places.find((p) => p.id === id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<PlaceType>(existing?.type ?? 'landmark');
  const [city, setCity] = useState<ID | null>(existing?.city_id ?? null);
  const [date, setDate] = useState(existing?.date ?? presetTrip?.start_date ?? todayIso());
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  const save = () =>
    submit(() => {
      const cityRow = getCity(db, city);
      if (!cityRow) throw new Error('Choose a city for the place.');
      // Places know their city; the exact pin is placed near the city center.
      const keepPosition = existing && existing.city_id === cityRow.id;
      const position = keepPosition
        ? { latitude: existing.latitude, longitude: existing.longitude }
        : jitterCoordinate(cityRow.latitude, cityRow.longitude, `${name}-${date}`, 0.05);
      const input = { trip_id: trip, name, city_id: cityRow.id, type, ...position, date, notes, visibility };
      if (existing) actions.updatePlace(existing.id, input);
      else actions.createPlace(input);
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete place', `Delete ${existing.name}?`, 'Delete', () => {
      actions.deletePlace(existing.id);
      router.back();
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit place' : 'New place'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete place"
    >
      <TextField label="Name" required value={name} onChangeText={setName} placeholder="Wat Pho" />
      <ChipSelect
        label="Type"
        value={type}
        onChange={setType}
        options={PLACE_TYPES.map((t) => ({ value: t, label: PLACE_TYPE_LABELS[t] }))}
      />
      <CityField value={city} onChange={setCity} required />
      <DateTimeField label="Date" required value={date} onChange={setDate} />
      <TripField value={trip} onChange={setTrip} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
