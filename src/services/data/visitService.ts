import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import {
  normalizeVisitImage,
  type DestinationVisit,
  type DestinationVisitInput,
} from '@/models/destinationVisit';
import { emptyToNull } from '../util/text';
import { isValidISODate, nowIso } from '../util/dates';
import { newId } from '../util/id';
import { notifyFollowers } from '../social/notificationService';
import { getCity } from './lookup';
import {
  findIn,
  insertInto,
  NotFoundError,
  patchIn,
  removeFrom,
  ValidationError,
  type Mutation,
} from './tables';

/**
 * Builds the stored shape of a visit. The country is always derived from the
 * city, and the image is normalized to the 0-or-1 shape, so callers cannot
 * produce inconsistent rows.
 */
function normalize(db: Database, input: DestinationVisitInput): DestinationVisitInput {
  const city = getCity(db, input.city_id);
  if (!city) throw new ValidationError('Choose a city for this destination visit.');
  if (!isValidISODate(input.visit_date)) throw new ValidationError('A visit date is required.');
  if (input.end_date && input.end_date < input.visit_date) {
    throw new ValidationError('The end date cannot be before the visit date.');
  }
  return {
    ...input,
    country_id: city.country_id,
    name: input.name.trim() || city.name,
    end_date: input.end_date || null,
    notes: emptyToNull(input.notes),
    image_path: normalizeVisitImage(input.image_path),
  };
}

/**
 * Creates a NEW visit entry. Adding Milan a second time never merges with an
 * earlier Milan visit: every occurrence is its own row (spec section 12).
 */
export function createVisit(
  db: Database,
  userId: ID,
  input: DestinationVisitInput,
): Mutation<DestinationVisit> {
  const now = nowIso();
  const visit: DestinationVisit = {
    ...normalize(db, input),
    id: newId('visit'),
    user_id: userId,
    created_at: now,
    updated_at: now,
  };
  let next = insertInto(db, 'destination_visits', visit);
  next = notifyFollowers(next, userId, 'destination_added', visit.id, visit.visibility);
  return { db: next, result: visit };
}

export function updateVisit(
  db: Database,
  id: ID,
  input: DestinationVisitInput,
): Mutation<DestinationVisit> {
  if (!findIn(db, 'destination_visits', id)) throw new NotFoundError('destination visit', id);
  const next = patchIn(db, 'destination_visits', id, { ...normalize(db, input), updated_at: nowIso() });
  return { db: next, result: findIn(next, 'destination_visits', id)! };
}

export function deleteVisit(db: Database, id: ID): Database {
  return removeFrom(db, 'destination_visits', id);
}

/** Sets or REPLACES the single representative image of a visit. */
export function setVisitImage(db: Database, id: ID, imagePath: string): Database {
  if (!findIn(db, 'destination_visits', id)) throw new NotFoundError('destination visit', id);
  return patchIn(db, 'destination_visits', id, {
    image_path: normalizeVisitImage(imagePath),
    updated_at: nowIso(),
  });
}

/** Removes the representative image of a visit. */
export function removeVisitImage(db: Database, id: ID): Database {
  if (!findIn(db, 'destination_visits', id)) throw new NotFoundError('destination visit', id);
  return patchIn(db, 'destination_visits', id, { image_path: null, updated_at: nowIso() });
}

/** All visits (separate occurrences) of one city by one user, newest first. */
export function visitsForCity(db: Database, userId: ID, cityId: ID): DestinationVisit[] {
  return db.destination_visits
    .filter((v) => v.user_id === userId && v.city_id === cityId)
    .sort((a, b) => b.visit_date.localeCompare(a.visit_date));
}
