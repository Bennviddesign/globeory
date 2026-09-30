import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Trip, TripInput } from '@/models/trip';
import { emptyToNull } from '../util/text';
import { isValidISODate, nowIso } from '../util/dates';
import { newId } from '../util/id';
import { notifyFollowers } from '../social/notificationService';
import {
  findIn,
  insertInto,
  NotFoundError,
  patchIn,
  removeFrom,
  ValidationError,
  type Mutation,
} from './tables';

function validateTrip(input: TripInput): void {
  if (!input.title.trim()) throw new ValidationError('Give the trip a name.');
  if (!isValidISODate(input.start_date) || !isValidISODate(input.end_date)) {
    throw new ValidationError('Start and end date are required.');
  }
  if (input.end_date < input.start_date) {
    throw new ValidationError('The end date cannot be before the start date.');
  }
}

function clean(input: TripInput): TripInput {
  return {
    ...input,
    title: input.title.trim(),
    description: emptyToNull(input.description),
    cover_image: input.cover_image || null,
  };
}

export function createTrip(db: Database, userId: ID, input: TripInput): Mutation<Trip> {
  validateTrip(input);
  const now = nowIso();
  const trip: Trip = { ...clean(input), id: newId('trip'), user_id: userId, created_at: now, updated_at: now };
  let next = insertInto(db, 'trips', trip);
  next = notifyFollowers(next, userId, 'trip_added', trip.id, trip.visibility);
  return { db: next, result: trip };
}

export function updateTrip(db: Database, id: ID, input: TripInput): Mutation<Trip> {
  if (!findIn(db, 'trips', id)) throw new NotFoundError('trip', id);
  validateTrip(input);
  const next = patchIn(db, 'trips', id, { ...clean(input), updated_at: nowIso() });
  return { db: next, result: findIn(next, 'trips', id)! };
}

export type TripDeleteMode =
  /** Keep the trip's flights, hotels, visits... as standalone entries. */
  | 'detach'
  /** Delete the trip and everything that belongs to it. */
  | 'cascade';

const TRIP_CHILD_TABLES = [
  'flights',
  'destination_visits',
  'hotels',
  'places',
  'activities',
  'memories',
] as const;

export function deleteTrip(db: Database, id: ID, mode: TripDeleteMode = 'detach'): Database {
  let next = removeFrom(db, 'trips', id);
  for (const table of TRIP_CHILD_TABLES) {
    const rows = next[table] as { trip_id: ID | null }[];
    const updated =
      mode === 'cascade'
        ? rows.filter((r) => r.trip_id !== id)
        : rows.map((r) => (r.trip_id === id ? { ...r, trip_id: null } : r));
    next = { ...next, [table]: updated } as Database;
  }
  return next;
}
