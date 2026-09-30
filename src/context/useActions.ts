import { useMemo } from 'react';
import type { ActivityInput } from '@/models/activity';
import type { ID, DistanceUnit, ProfileVisibility } from '@/models/common';
import type { DestinationVisitInput } from '@/models/destinationVisit';
import type { FlightInput } from '@/models/flight';
import type { HotelInput } from '@/models/hotel';
import type { MemoryInput } from '@/models/memory';
import type { PlaceInput } from '@/models/place';
import type { TripInput } from '@/models/trip';
import type { UserInput } from '@/models/user';
import { createActivity, deleteActivity, updateActivity } from '@/services/data/activityService';
import { createFlight, deleteFlight, updateFlight } from '@/services/data/flightService';
import { createHotel, deleteHotel, updateHotel } from '@/services/data/hotelService';
import { createMemory, deleteMemory, updateMemory } from '@/services/data/memoryService';
import { createPlace, deletePlace, updatePlace } from '@/services/data/placeService';
import { createTrip, deleteTrip, updateTrip, type TripDeleteMode } from '@/services/data/tripService';
import { setPreferredUnit, setProfileVisibility, updateUser } from '@/services/data/userService';
import {
  createVisit,
  deleteVisit,
  removeVisitImage,
  setVisitImage,
  updateVisit,
} from '@/services/data/visitService';
import { getVisit } from '@/services/data/lookup';
import { deleteStoredImage } from '@/services/images/imageService';
import { follow, unfollow } from '@/services/social/followService';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/social/notificationService';
import { useData } from './DataContext';

/**
 * Every write the UI can perform, bound to the signed-in user. Screens call
 * these instead of touching the database directly.
 */
export function useActions() {
  const { mutate, update, currentUserId } = useData();

  return useMemo(() => {
    const me = (): ID => {
      if (!currentUserId) throw new Error('No signed-in user');
      return currentUserId;
    };

    return {
      // Trips
      createTrip: (input: TripInput) => mutate((db) => createTrip(db, me(), input)),
      updateTrip: (id: ID, input: TripInput) => mutate((db) => updateTrip(db, id, input)),
      deleteTrip: (id: ID, mode: TripDeleteMode = 'detach') => update((db) => deleteTrip(db, id, mode)),

      // Destination visits (one representative image each)
      createVisit: (input: DestinationVisitInput) => mutate((db) => createVisit(db, me(), input)),
      updateVisit: (id: ID, input: DestinationVisitInput) => mutate((db) => updateVisit(db, id, input)),
      deleteVisit: (id: ID) =>
        update((db) => {
          deleteStoredImage(getVisit(db, id)?.image_path);
          return deleteVisit(db, id);
        }),
      /** Sets or replaces the single image; the previous local file is cleaned up. */
      setVisitImage: (id: ID, imagePath: string) =>
        update((db) => {
          const previous = getVisit(db, id)?.image_path;
          if (previous && previous !== imagePath) deleteStoredImage(previous);
          return setVisitImage(db, id, imagePath);
        }),
      removeVisitImage: (id: ID) =>
        update((db) => {
          deleteStoredImage(getVisit(db, id)?.image_path);
          return removeVisitImage(db, id);
        }),

      // Flights (distance is always computed)
      createFlight: (input: FlightInput) => mutate((db) => createFlight(db, me(), input)),
      updateFlight: (id: ID, input: FlightInput) => mutate((db) => updateFlight(db, id, input)),
      deleteFlight: (id: ID) => update((db) => deleteFlight(db, id)),

      // Hotels, places, activities, memories
      createHotel: (input: HotelInput) => mutate((db) => createHotel(db, me(), input)),
      updateHotel: (id: ID, input: HotelInput) => mutate((db) => updateHotel(db, id, input)),
      deleteHotel: (id: ID) => update((db) => deleteHotel(db, id)),
      createPlace: (input: PlaceInput) => mutate((db) => createPlace(db, me(), input)),
      updatePlace: (id: ID, input: PlaceInput) => mutate((db) => updatePlace(db, id, input)),
      deletePlace: (id: ID) => update((db) => deletePlace(db, id)),
      createActivity: (input: ActivityInput) => mutate((db) => createActivity(db, me(), input)),
      updateActivity: (id: ID, input: ActivityInput) => mutate((db) => updateActivity(db, id, input)),
      deleteActivity: (id: ID) => update((db) => deleteActivity(db, id)),
      createMemory: (input: MemoryInput) => mutate((db) => createMemory(db, me(), input)),
      updateMemory: (id: ID, input: MemoryInput) => mutate((db) => updateMemory(db, id, input)),
      deleteMemory: (id: ID) => update((db) => deleteMemory(db, id)),

      // Profile
      updateProfile: (input: UserInput) => mutate((db) => updateUser(db, me(), input)),
      setProfileVisibility: (value: ProfileVisibility) =>
        update((db) => setProfileVisibility(db, me(), value)),
      setPreferredUnit: (unit: DistanceUnit) => update((db) => setPreferredUnit(db, me(), unit)),

      // Social
      follow: (userId: ID) => update((db) => follow(db, me(), userId).db),
      unfollow: (userId: ID) => update((db) => unfollow(db, me(), userId)),
      markNotificationRead: (id: ID) => update((db) => markNotificationRead(db, id)),
      markAllNotificationsRead: () => update((db) => markAllNotificationsRead(db, me())),
    };
  }, [mutate, update, currentUserId]);
}
