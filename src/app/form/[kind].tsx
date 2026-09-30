import { useLocalSearchParams } from 'expo-router';
import { ActivityForm } from '@/components/forms/ActivityForm';
import { FlightForm } from '@/components/forms/FlightForm';
import { HotelForm } from '@/components/forms/HotelForm';
import { MemoryForm } from '@/components/forms/MemoryForm';
import { PlaceForm } from '@/components/forms/PlaceForm';
import { TripForm } from '@/components/forms/TripForm';
import { VisitForm } from '@/components/forms/VisitForm';
import { EmptyState } from '@/components/common/StateViews';

/**
 * One route for every Add / Edit form:
 *   /form/trip, /form/visit?tripId=..., /form/flight?id=..., ...
 */
export default function FormRoute() {
  const { kind, id, tripId, cityId } = useLocalSearchParams<{
    kind: string;
    id?: string;
    tripId?: string;
    cityId?: string;
  }>();

  switch (kind) {
    case 'trip':
      return <TripForm id={id} />;
    case 'visit':
      return <VisitForm id={id} tripId={tripId} cityId={cityId} />;
    case 'flight':
      return <FlightForm id={id} tripId={tripId} />;
    case 'hotel':
      return <HotelForm id={id} tripId={tripId} />;
    case 'place':
      return <PlaceForm id={id} tripId={tripId} />;
    case 'activity':
      return <ActivityForm id={id} tripId={tripId} />;
    case 'memory':
      return <MemoryForm id={id} tripId={tripId} />;
    default:
      return <EmptyState title="Unknown form" icon="help-circle-outline" />;
  }
}
