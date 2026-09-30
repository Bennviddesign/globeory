import { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import type { ID, Visibility } from '@/models/common';
import { getTrip, getVisit } from '@/services/data/lookup';
import { deleteStoredImage } from '@/services/images/imageService';
import { todayIso } from '@/services/util/dates';
import { confirmDestructive } from '../modals/confirm';
import { useRouter } from 'expo-router';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { ImageField } from './ImageField';
import { CityField, TripField } from './PickerField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

interface VisitFormProps {
  id?: string;
  tripId?: string;
  cityId?: string;
}

/**
 * Add / edit ONE destination visit. Adding Milan again creates a new, separate
 * visit with its own date, notes and its own (optional) single image.
 */
export function VisitForm({ id, tripId, cityId }: VisitFormProps) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = getVisit(db, id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [city, setCity] = useState<ID | null>(existing?.city_id ?? cityId ?? null);
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [start, setStart] = useState(existing?.visit_date ?? presetTrip?.start_date ?? todayIso());
  const [end, setEnd] = useState(existing?.end_date ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [image, setImage] = useState<string | null>(existing?.image_path ?? null);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  // Clean up a freshly copied image file if the user leaves without saving.
  const saved = useRef(false);
  const initialImage = existing?.image_path ?? null;
  const currentImage = useRef(image);
  currentImage.current = image;
  useEffect(
    () => () => {
      if (!saved.current && currentImage.current && currentImage.current !== initialImage) {
        deleteStoredImage(currentImage.current);
      }
    },
    [initialImage],
  );

  const save = () =>
    submit(() => {
      if (!city) throw new Error('Choose a city for this destination visit.');
      const input = {
        trip_id: trip,
        city_id: city,
        country_id: '', // derived from the city by the service
        name: '',
        visit_date: start,
        end_date: end || null,
        notes,
        image_path: image,
        visibility,
      };
      if (existing) {
        actions.updateVisit(existing.id, input);
        if (initialImage && initialImage !== image) deleteStoredImage(initialImage);
        saved.current = true;
        return;
      }
      const created = actions.createVisit(input);
      saved.current = true;
      return { href: `/visit/${created.id}` };
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete visit', `Delete this visit to ${existing.name}? Other visits to the same city are not affected.`, 'Delete', () => {
      saved.current = true;
      actions.deleteVisit(existing.id);
      router.replace('/trips');
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit destination visit' : 'New destination visit'}
      subtitle="Every visit is its own entry, even to the same city."
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete visit"
    >
      <CityField value={city} onChange={setCity} required />
      <DateTimeField label="Arrival" required value={start} onChange={setStart} />
      <DateTimeField label="Departure" value={end} onChange={setEnd} clearable hint="Optional. Used to count days." />
      <TripField value={trip} onChange={setTrip} />
      <ImageField value={image} onChange={setImage} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="What do you want to remember about this visit?" />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
