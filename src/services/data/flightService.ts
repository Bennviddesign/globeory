import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Flight, FlightInput } from '@/models/flight';
import type { Airport } from '@/models/reference';
import { haversineKm, roundDistanceKm } from '../geo/distance';
import { emptyToNull } from '../util/text';
import { nowIso } from '../util/dates';
import { newId } from '../util/id';
import { getAirport } from './lookup';
import {
  findIn,
  insertInto,
  NotFoundError,
  patchIn,
  removeFrom,
  ValidationError,
  type Mutation,
} from './tables';

/** Great-circle distance between two airports in km (spec section 18). */
export function distanceBetweenAirportsKm(departure: Airport, arrival: Airport): number {
  return roundDistanceKm(
    haversineKm(departure.latitude, departure.longitude, arrival.latitude, arrival.longitude),
  );
}

function resolveAirports(db: Database, input: FlightInput) {
  const departure = getAirport(db, input.departure_airport_id);
  const arrival = getAirport(db, input.arrival_airport_id);
  if (!departure) throw new ValidationError('Choose a departure airport.');
  if (!arrival) throw new ValidationError('Choose an arrival airport.');
  if (departure.id === arrival.id) {
    throw new ValidationError('Departure and arrival airport must be different.');
  }
  if (Number.isNaN(new Date(input.departure_datetime).getTime())) {
    throw new ValidationError('A departure date and time is required.');
  }
  if (
    input.arrival_datetime &&
    new Date(input.arrival_datetime).getTime() < new Date(input.departure_datetime).getTime()
  ) {
    throw new ValidationError('The flight cannot arrive before it departs.');
  }
  return { departure, arrival };
}

function clean(input: FlightInput): FlightInput {
  return {
    ...input,
    airline: emptyToNull(input.airline),
    flight_number: emptyToNull(input.flight_number)?.toUpperCase() ?? null,
    notes: emptyToNull(input.notes),
    arrival_datetime: input.arrival_datetime || null,
  };
}

/**
 * Saves a flight. `distance_km` is ALWAYS computed from the airport
 * coordinates; there is no way to pass it in.
 */
export function createFlight(db: Database, userId: ID, input: FlightInput): Mutation<Flight> {
  const { departure, arrival } = resolveAirports(db, input);
  const flight: Flight = {
    ...clean(input),
    id: newId('flight'),
    user_id: userId,
    distance_km: distanceBetweenAirportsKm(departure, arrival),
    created_at: nowIso(),
  };
  return { db: insertInto(db, 'flights', flight), result: flight };
}

/** Updating a flight recalculates the distance because the airports may have changed. */
export function updateFlight(db: Database, id: ID, input: FlightInput): Mutation<Flight> {
  if (!findIn(db, 'flights', id)) throw new NotFoundError('flight', id);
  const { departure, arrival } = resolveAirports(db, input);
  const next = patchIn(db, 'flights', id, {
    ...clean(input),
    distance_km: distanceBetweenAirportsKm(departure, arrival),
  });
  return { db: next, result: findIn(next, 'flights', id)! };
}

export function deleteFlight(db: Database, id: ID): Database {
  return removeFrom(db, 'flights', id);
}

/** Recomputes every stored distance (used by the integrity pass when loading data). */
export function recalculateFlightDistances(db: Database): Database {
  let changed = false;
  const flights = db.flights.map((flight) => {
    const departure = getAirport(db, flight.departure_airport_id);
    const arrival = getAirport(db, flight.arrival_airport_id);
    if (!departure || !arrival) return flight;
    const distance = distanceBetweenAirportsKm(departure, arrival);
    if (distance === flight.distance_km) return flight;
    changed = true;
    return { ...flight, distance_km: distance };
  });
  return changed ? { ...db, flights } : db;
}
