import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ACTIVITY_TYPE_LABELS } from '@/constants/categories';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import { ACTIVITY_TYPES, type ActivityType } from '@/models/activity';
import type { ID, Visibility } from '@/models/common';
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

/** Things the user did: sightseeing, food, adventure... */
export function ActivityForm({ id, tripId }: { id?: string; tripId?: string }) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = db.activities.find((a) => a.id === id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<ActivityType>(existing?.type ?? 'sightseeing');
  const [city, setCity] = useState<ID | null>(existing?.city_id ?? null);
  const [date, setDate] = useState(existing?.date ?? presetTrip?.start_date ?? todayIso());
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  const save = () =>
    submit(() => {
      const cityRow = getCity(db, city);
      if (!cityRow) throw new Error('Choose a city for the activity.');
      const keepPosition = existing && existing.city_id === cityRow.id;
      const position = keepPosition
        ? { latitude: existing.latitude, longitude: existing.longitude }
        : jitterCoordinate(cityRow.latitude, cityRow.longitude, `${name}-${date}`, 0.06);
      const input = { trip_id: trip, name, city_id: cityRow.id, type, ...position, date, description, visibility };
      if (existing) actions.updateActivity(existing.id, input);
      else actions.createActivity(input);
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete activity', `Delete ${existing.name}?`, 'Delete', () => {
      actions.deleteActivity(existing.id);
      router.back();
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit activity' : 'New activity'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete activity"
    >
      <TextField label="Name" required value={name} onChangeText={setName} placeholder="Snorkeling trip" />
      <ChipSelect
        label="Type"
        value={type}
        onChange={setType}
        options={ACTIVITY_TYPES.map((t) => ({ value: t, label: ACTIVITY_TYPE_LABELS[t] }))}
      />
      <CityField value={city} onChange={setCity} required />
      <DateTimeField label="Date" required value={date} onChange={setDate} />
      <TripField value={trip} onChange={setTrip} />
      <TextField label="Description" value={description} onChangeText={setDescription} multiline />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
