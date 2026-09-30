import type { Activity } from '@/models/activity';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { Flight } from '@/models/flight';
import type { Hotel } from '@/models/hotel';
import type { Memory } from '@/models/memory';
import type { Place } from '@/models/place';
import type { Trip } from '@/models/trip';

/** The user-owned rows of one demo storyline. */
export interface SeedBundle {
  trips: Trip[];
  visits: DestinationVisit[];
  flights: Flight[];
  hotels: Hotel[];
  activities: Activity[];
  places: Place[];
  memories: Memory[];
}

export function mergeBundles(...bundles: SeedBundle[]): SeedBundle {
  return {
    trips: bundles.flatMap((b) => b.trips),
    visits: bundles.flatMap((b) => b.visits),
    flights: bundles.flatMap((b) => b.flights),
    hotels: bundles.flatMap((b) => b.hotels),
    activities: bundles.flatMap((b) => b.activities),
    places: bundles.flatMap((b) => b.places),
    memories: bundles.flatMap((b) => b.memories),
  };
}
