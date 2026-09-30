import type { Activity, ActivityType } from '@/models/activity';
import type { ID, Visibility } from '@/models/common';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { Flight } from '@/models/flight';
import type { Hotel } from '@/models/hotel';
import type { Memory } from '@/models/memory';
import type { Place, PlaceType } from '@/models/place';
import type { Trip } from '@/models/trip';
import { AIRPORTS, airportIdFor } from '../reference/airports';
import { CITIES, cityIdFor } from '../reference/cities';
import { haversineKm, roundDistanceKm } from '../geo/distance';
import { jitterCoordinate } from '../geo/jitter';
import { addDays, daysAgoIso } from '../util/dates';
import { DEMO_IMAGES, type DemoImageKey } from './demoImages';

/**
 * Small factory functions that keep the demo data files short and readable.
 * They produce exactly the same rows the real services would.
 */

const cityById = new Map(CITIES.map((c) => [c.id, c]));
const airportById = new Map(AIRPORTS.map((a) => [a.id, a]));

const noonOf = (date: string) => `${date}T12:00:00.000Z`;

export const imageOf = (key?: DemoImageKey): string | null => (key ? DEMO_IMAGES[key] : null);

interface CommonOptions {
  vis?: Visibility;
  /** Pretend the entry was added this many days ago (for "Added 3 days ago"). */
  addedDaysAgo?: number;
}

const createdAt = (date: string, opts?: CommonOptions, offsetDays = 1) =>
  opts?.addedDaysAgo !== undefined ? daysAgoIso(opts.addedDaysAgo) : noonOf(addDays(date, offsetDays));

export function trip(
  id: ID,
  userId: ID,
  title: string,
  description: string,
  start: string,
  end: string,
  cover?: DemoImageKey,
  opts?: CommonOptions,
): Trip {
  const created = createdAt(start, opts, -7);
  return {
    id,
    user_id: userId,
    title,
    description,
    start_date: start,
    end_date: end,
    cover_image: imageOf(cover),
    visibility: opts?.vis ?? 'public',
    created_at: created,
    updated_at: created,
  };
}

export function visit(
  id: ID,
  userId: ID,
  tripId: ID | null,
  cityKey: string,
  start: string,
  end: string | null,
  image?: DemoImageKey,
  notes?: string,
  opts?: CommonOptions,
): DestinationVisit {
  const city = cityById.get(cityIdFor(cityKey));
  if (!city) throw new Error(`Unknown demo city: ${cityKey}`);
  const created = createdAt(start, opts);
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    city_id: city.id,
    country_id: city.country_id,
    name: city.name,
    visit_date: start,
    end_date: end,
    notes: notes ?? null,
    image_path: imageOf(image), // 0 or 1 image per visit
    visibility: opts?.vis ?? 'public',
    created_at: created,
    updated_at: created,
  };
}

/** Departure time is local `YYYY-MM-DD HH:mm`; arrival is estimated from the distance. */
export function flight(
  id: ID,
  userId: ID,
  tripId: ID | null,
  from: string,
  to: string,
  departure: string,
  airline: string,
  flightNumber: string,
  opts?: CommonOptions,
): Flight {
  const dep = airportById.get(airportIdFor(from));
  const arr = airportById.get(airportIdFor(to));
  if (!dep || !arr) throw new Error(`Unknown demo airport: ${from} / ${to}`);
  const distance = roundDistanceKm(
    haversineKm(dep.latitude, dep.longitude, arr.latitude, arr.longitude),
  );
  const departAt = new Date(departure.replace(' ', 'T') + ':00');
  const flightMinutes = Math.round((distance / 820) * 60 + 35);
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    departure_airport_id: dep.id,
    arrival_airport_id: arr.id,
    departure_datetime: departAt.toISOString(),
    arrival_datetime: new Date(departAt.getTime() + flightMinutes * 60000).toISOString(),
    airline,
    flight_number: flightNumber,
    distance_km: distance,
    notes: null,
    visibility: opts?.vis ?? 'public',
    created_at: createdAt(departure.slice(0, 10), opts),
  };
}

export function hotel(
  id: ID,
  userId: ID,
  tripId: ID | null,
  name: string,
  cityKey: string,
  checkIn: string,
  checkOut: string,
  address?: string,
  image?: DemoImageKey,
  opts?: CommonOptions,
): Hotel {
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    name,
    city_id: cityIdFor(cityKey),
    address: address ?? null,
    check_in: checkIn,
    check_out: checkOut,
    image_path: imageOf(image),
    notes: null,
    visibility: opts?.vis ?? 'public',
    created_at: createdAt(checkIn, opts),
  };
}

export function activity(
  id: ID,
  userId: ID,
  tripId: ID | null,
  name: string,
  cityKey: string,
  type: ActivityType,
  date: string,
  description?: string,
  opts?: CommonOptions,
): Activity {
  const city = cityById.get(cityIdFor(cityKey));
  if (!city) throw new Error(`Unknown demo city: ${cityKey}`);
  const pos = jitterCoordinate(city.latitude, city.longitude, id, 0.06);
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    name,
    city_id: city.id,
    type,
    latitude: pos.latitude,
    longitude: pos.longitude,
    date,
    description: description ?? null,
    visibility: opts?.vis ?? 'public',
    created_at: createdAt(date, opts),
  };
}

export function place(
  id: ID,
  userId: ID,
  tripId: ID | null,
  name: string,
  cityKey: string,
  type: PlaceType,
  date: string,
  notes?: string,
  opts?: CommonOptions,
): Place {
  const city = cityById.get(cityIdFor(cityKey));
  if (!city) throw new Error(`Unknown demo city: ${cityKey}`);
  const pos = jitterCoordinate(city.latitude, city.longitude, id, 0.05);
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    name,
    city_id: city.id,
    type,
    latitude: pos.latitude,
    longitude: pos.longitude,
    date,
    notes: notes ?? null,
    visibility: opts?.vis ?? 'public',
    created_at: createdAt(date, opts),
  };
}

export function memory(
  id: ID,
  userId: ID,
  tripId: ID | null,
  title: string,
  description: string,
  cityKey: string | null,
  date: string,
  opts?: CommonOptions,
): Memory {
  const created = createdAt(date, opts);
  return {
    id,
    user_id: userId,
    trip_id: tripId,
    title,
    description,
    city_id: cityKey ? cityIdFor(cityKey) : null,
    date,
    visibility: opts?.vis ?? 'public',
    created_at: created,
    updated_at: created,
  };
}
