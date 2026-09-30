import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import type { ID, Visibility } from '@/models/common';
import { getTrip } from '@/services/data/lookup';
import { deleteStoredImage } from '@/services/images/imageService';
import { addDays, todayIso } from '@/services/util/dates';
import { confirmDestructive } from '../modals/confirm';
import { DateTimeField } from './DateTimeField';
import { FormScreen } from './FormScreen';
import { ImageField } from './ImageField';
import { CityField, TripField } from './PickerField';
import { TextField } from './TextField';
import { useFormSubmit } from './useFormSubmit';
import { VisibilityField } from './VisibilityField';

export function HotelForm({ id, tripId }: { id?: string; tripId?: string }) {
  const router = useRouter();
  const { db } = useData();
  const actions = useActions();
  const existing = db.hotels.find((h) => h.id === id);
  const presetTrip = getTrip(db, existing?.trip_id ?? tripId);
  const { submit, saving } = useFormSubmit();

  const [name, setName] = useState(existing?.name ?? '');
  const [city, setCity] = useState<ID | null>(existing?.city_id ?? null);
  const [address, setAddress] = useState(existing?.address ?? '');
  const [checkIn, setCheckIn] = useState(existing?.check_in ?? presetTrip?.start_date ?? todayIso());
  const [checkOut, setCheckOut] = useState(existing?.check_out ?? addDays(presetTrip?.start_date ?? todayIso(), 3));
  const [trip, setTrip] = useState<ID | null>(existing?.trip_id ?? tripId ?? null);
  const [image, setImage] = useState<string | null>(existing?.image_path ?? null);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? 'public');

  const save = () =>
    submit(() => {
      if (!city) throw new Error('Choose a city for the hotel.');
      const input = {
        trip_id: trip,
        name,
        city_id: city,
        address,
        check_in: checkIn,
        check_out: checkOut,
        image_path: image,
        notes,
        visibility,
      };
      if (existing) {
        if (existing.image_path && existing.image_path !== image) deleteStoredImage(existing.image_path);
        actions.updateHotel(existing.id, input);
      } else actions.createHotel(input);
    });

  const remove = () => {
    if (!existing) return;
    confirmDestructive('Delete hotel', `Delete ${existing.name}?`, 'Delete', () => {
      deleteStoredImage(existing.image_path);
      actions.deleteHotel(existing.id);
      router.back();
    });
  };

  return (
    <FormScreen
      title={existing ? 'Edit hotel' : 'New hotel'}
      onSave={save}
      saving={saving}
      onDelete={existing ? remove : undefined}
      deleteLabel="Delete hotel"
    >
      <TextField label="Hotel name" required value={name} onChangeText={setName} placeholder="Riverside Heritage Hotel" />
      <CityField value={city} onChange={setCity} required />
      <TextField label="Address" value={address} onChangeText={setAddress} placeholder="Optional" />
      <DateTimeField label="Check-in" required value={checkIn} onChange={setCheckIn} />
      <DateTimeField label="Check-out" required value={checkOut} onChange={setCheckOut} />
      <TripField value={trip} onChange={setTrip} />
      <ImageField label="Hotel image" value={image} onChange={setImage} />
      <TextField label="Notes" value={notes} onChangeText={setNotes} multiline />
      <VisibilityField value={visibility} onChange={setVisibility} />
    </FormScreen>
  );
}
