import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Place, PlaceInput } from '@/models/place';
import { emptyToNull } from '../util/text';
import { isValidISODate, nowIso } from '../util/dates';
import { newId } from '../util/id';
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

function clean(db: Database, input: PlaceInput): PlaceInput {
  if (!input.name.trim()) throw new ValidationError('Give the place a name.');
  if (!getCity(db, input.city_id)) throw new ValidationError('Choose a city for the place.');
  if (!isValidISODate(input.date)) throw new ValidationError('A date is required.');
  return { ...input, name: input.name.trim(), notes: emptyToNull(input.notes) };
}

export function createPlace(db: Database, userId: ID, input: PlaceInput): Mutation<Place> {
  const place: Place = { ...clean(db, input), id: newId('place'), user_id: userId, created_at: nowIso() };
  return { db: insertInto(db, 'places', place), result: place };
}

export function updatePlace(db: Database, id: ID, input: PlaceInput): Mutation<Place> {
  if (!findIn(db, 'places', id)) throw new NotFoundError('place', id);
  const next = patchIn(db, 'places', id, clean(db, input));
  return { db: next, result: findIn(next, 'places', id)! };
}

export function deletePlace(db: Database, id: ID): Database {
  return removeFrom(db, 'places', id);
}
