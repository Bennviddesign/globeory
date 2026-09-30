import type { ID, ISODateTime, Visibility } from './common';

/** `flights` table. */
export interface Flight {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  departure_airport_id: ID;
  arrival_airport_id: ID;
  departure_datetime: ISODateTime;
  arrival_datetime: ISODateTime | null;
  airline: string | null;
  flight_number: string | null;
  /**
   * Great-circle distance in kilometers (canonical unit).
   * Always computed by `flightService` with the Haversine formula from the
   * departure and arrival airport coordinates (spec section 18).
   */
  distance_km: number;
  notes: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
}

/**
 * What a form may provide when creating/editing a flight.
 * `distance_km` is deliberately absent: the distance is not manually
 * editable, it is derived from the airports.
 */
export type FlightInput = Omit<Flight, 'id' | 'user_id' | 'distance_km' | 'created_at'>;
