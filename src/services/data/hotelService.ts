import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import { normalizeVisitImage } from '@/models/destinationVisit';
import type { Hotel, HotelInput } from '@/models/hotel';
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

function clean(db: Database, input: HotelInput): HotelInput {
  if (!input.name.trim()) throw new ValidationError('Give the hotel a name.');
  if (!getCity(db, input.city_id)) throw new ValidationError('Choose a city for the hotel.');
  if (!isValidISODate(input.check_in) || !isValidISODate(input.check_out)) {
    throw new ValidationError('Check-in and check-out dates are required.');
  }
  if (input.check_out < input.check_in) {
    throw new ValidationError('Check-out cannot be before check-in.');
  }
  return {
    ...input,
    name: input.name.trim(),
    address: emptyToNull(input.address),
    notes: emptyToNull(input.notes),
    // A hotel may have at most one representative image.
    image_path: normalizeVisitImage(input.image_path),
  };
}

export function createHotel(db: Database, userId: ID, input: HotelInput): Mutation<Hotel> {
  const hotel: Hotel = { ...clean(db, input), id: newId('hotel'), user_id: userId, created_at: nowIso() };
  return { db: insertInto(db, 'hotels', hotel), result: hotel };
}

export function updateHotel(db: Database, id: ID, input: HotelInput): Mutation<Hotel> {
  if (!findIn(db, 'hotels', id)) throw new NotFoundError('hotel', id);
  const next = patchIn(db, 'hotels', id, clean(db, input));
  return { db: next, result: findIn(next, 'hotels', id)! };
}

export function deleteHotel(db: Database, id: ID): Database {
  return removeFrom(db, 'hotels', id);
}
