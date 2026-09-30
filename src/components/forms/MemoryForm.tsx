import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import type { ID, Visibility } from '@/models/common';
import { getTrip } from '@/services/data/lookup';
import { todayIso } from '@/services/util/dates';
import { confirmDestructive } from '../modals/confirm';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { CityField, TripField } from './PickerField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

/** A personal note / moment. Text only: memories are separate from the one-image rule. */
export function MemoryForm({ id, tripId }: { id?: string; tripId?: string }) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = db.memories.find((m) => m.id === id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [city, setCity] = useState<ID | null>(existing?.city_id ?? null);
  const [date, setDate] = useState(existing?.date ?? presetTrip?.start_date ?? todayIso());
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'private');

  const save = () =>
    submit(() => {
      const input = { trip_id: trip, title, description, city_id: city, date, visibility };
      if (existing) actions.updateMemory(existing.id, input);
      else actions.createMemory(input);
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete memory', `Delete "${existing.title}"?`, 'Delete', () => {
      actions.deleteMemory(existing.id);
      router.back();
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit memory' : 'New memory'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete memory"
    >
      <TextField label="Title" required value={title} onChangeText={setTitle} placeholder="Sunrise over Chaweng" />
      <TextField label="What do you want to remember?" value={description} onChangeText={setDescription} multiline />
      <DateTimeField label="Date" required value={date} onChange={setDate} />
      <CityField label="Location (optional)" value={city} onChange={setCity} />
      <TripField value={trip} onChange={setTrip} />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
