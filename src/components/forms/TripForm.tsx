import { Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import type { Visibility } from '@/models/common';
import { getTrip } from '@/services/data/lookup';
import { deleteStoredImage } from '@/services/images/imageService';
import { addDays, todayIso } from '@/services/util/dates';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { ImageField } from './ImageField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

/** Add / edit a trip: name, dates, cover image, description, visibility. */
export function TripForm({ id }: { id?: string }) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = getTrip(db, id);
  const { submit, saving } = useFormSubmit();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [start, setStart] = useState(existing?.start_date ?? todayIso());
  const [end, setEnd] = useState(existing?.end_date ?? addDays(todayIso(), 6));
  const [cover, setCover] = useState<string | null>(existing?.cover_image ?? null);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  const save = () =>
    submit(() => {
      const input = { title, description, start_date: start, end_date: end, cover_image: cover, visibility };
      if (existing) {
        if (existing.cover_image && existing.cover_image !== cover) deleteStoredImage(existing.cover_image);
        actions.updateTrip(existing.id, input);
        return;
      }
      const trip = actions.createTrip(input);
      return { href: `/trip/${trip.id}` };
    });

  const remove = () => {
    if (!existing) return;
    Alert.alert('Delete trip', `What should happen to the entries in "${existing.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Keep entries',
        onPress: () => {
          actions.deleteTrip(existing.id, 'detach');
          router.replace('/trips');
        },
      },
      {
        text: 'Delete everything',
        style: 'destructive',
        onPress: () => {
          actions.deleteTrip(existing.id, 'cascade');
          router.replace('/trips');
        },
      },
    ]);
  };

  return (
    <FormScreen
      title={existing ? 'Edit trip' : 'New trip'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete trip"
    >
      <TextField label="Trip name" required value={title} onChangeText={setTitle} placeholder="Thailand Adventure" />
      <DateTimeField label="Start date" required value={start} onChange={setStart} />
      <DateTimeField label="End date" required value={end} onChange={setEnd} />
      <ImageField label="Cover image" value={cover} onChange={setCover} />
      <TextField label="Description" value={description} onChangeText={setDescription} multiline placeholder="What was this trip about?" />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
