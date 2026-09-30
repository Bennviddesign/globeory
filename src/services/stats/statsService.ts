import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Flight } from '@/models/flight';
import type { Airport } from '@/models/reference';
import { getAirport } from '../data/lookup';
import { addDays, daysInclusive } from '../util/dates';

export interface TravelStats {
  /** Distinct countries with at least one visit. */
  countries: number;
  /** Distinct cities with at least one visit. */
  cities: number;
  /** Total destination visit entries (repeated visits counted separately). */
  visits: number;
  flights: number;
  airports: number;
  hotels: number;
  trips: number;
  activities: number;
  places: number;
  memories: number;
  travelDays: number;
  totalDistanceKm: number;
  longestFlight: Flight | null;
  airportsVisited: Airport[];
}

/**
 * Spec section 37. `db` should already be scoped to what the viewer may see
 * (see `scopeToUser`), so the same function serves own and public profiles.
 */
export function computeStats(db: Database, userId: ID): TravelStats {
  const visits = db.destination_visits.filter((v) => v.user_id === userId);
  const flights = db.flights.filter((f) => f.user_id === userId);

  const airportIds = new Set<ID>();
  for (const f of flights) {
    airportIds.add(f.departure_airport_id);
    airportIds.add(f.arrival_airport_id);
  }
  const airportsVisited = [...airportIds]
    .map((id) => getAirport(db, id))
    .filter((a): a is Airport => Boolean(a));

  const longestFlight = flights.reduce<Flight | null>(
    (best, f) => (!best || f.distance_km > best.distance_km ? f : best),
    null,
  );

  return {
    countries: new Set(visits.map((v) => v.country_id)).size,
    cities: new Set(visits.map((v) => v.city_id)).size,
    visits: visits.length,
    flights: flights.length,
    airports: airportIds.size,
    hotels: db.hotels.filter((h) => h.user_id === userId).length,
    trips: db.trips.filter((t) => t.user_id === userId).length,
    activities: db.activities.filter((a) => a.user_id === userId).length,
    places: db.places.filter((p) => p.user_id === userId).length,
    memories: db.memories.filter((m) => m.user_id === userId).length,
    travelDays: countTravelDays(db, userId),
    totalDistanceKm: flights.reduce((sum, f) => sum + f.distance_km, 0),
    longestFlight,
    airportsVisited,
  };
}

/** Distinct calendar days covered by trips and by visits that are not part of a trip. */
export function countTravelDays(db: Database, userId: ID): number {
  const days = new Set<string>();
  const addRange = (start: string, end: string) => {
    const length = Math.min(daysInclusive(start, end), 400);
    for (let i = 0; i < length; i++) days.add(addDays(start, i));
  };
  for (const trip of db.trips) {
    if (trip.user_id === userId) addRange(trip.start_date, trip.end_date);
  }
  for (const visit of db.destination_visits) {
    if (visit.user_id === userId && !visit.trip_id) {
      addRange(visit.visit_date, visit.end_date ?? visit.visit_date);
    }
  }
  return days.size;
}
