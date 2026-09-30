import type { ID } from './common';

/**
 * Reference tables: countries, cities and airports are permanent locations.
 * They are NOT visits. A visit (see `destinationVisit.ts`) references them.
 */

/** `countries` table. */
export interface Country {
  id: ID;
  name: string;
  /** ISO 3166-1 alpha-2, e.g. `TH`. */
  iso_code: string;
  latitude: number;
  longitude: number;
}

/** `cities` table. */
export interface City {
  id: ID;
  name: string;
  country_id: ID;
  latitude: number;
  longitude: number;
}

/** `airports` table. */
export interface Airport {
  id: ID;
  name: string;
  iata_code: string;
  icao_code: string;
  city_id: ID;
  latitude: number;
  longitude: number;
}
