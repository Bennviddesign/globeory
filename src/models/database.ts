import type { Activity } from './activity';
import type { DestinationVisit } from './destinationVisit';
import type { Flight } from './flight';
import type { Hotel } from './hotel';
import type { Memory } from './memory';
import type { Place } from './place';
import type { Airport, City, Country } from './reference';
import type { AppNotification, Follow } from './social';
import type { Trip } from './trip';
import type { User } from './user';

/**
 * The whole local database. Every key is a table with the same name as in
 * the planned Supabase schema (spec section 40).
 */
export interface Database {
  users: User[];
  trips: Trip[];
  countries: Country[];
  cities: City[];
  airports: Airport[];
  flights: Flight[];
  destination_visits: DestinationVisit[];
  hotels: Hotel[];
  places: Place[];
  activities: Activity[];
  memories: Memory[];
  follows: Follow[];
  notifications: AppNotification[];
}

export type TableName = keyof Database;

/** Reference tables ship with the app and are never persisted. */
export const REFERENCE_TABLES = ['countries', 'cities', 'airports'] as const satisfies readonly TableName[];

/** Tables that hold user data and are written to local storage. */
export const PERSISTED_TABLES = [
  'users',
  'trips',
  'flights',
  'destination_visits',
  'hotels',
  'places',
  'activities',
  'memories',
  'follows',
  'notifications',
] as const satisfies readonly TableName[];

export type PersistedTableName = (typeof PERSISTED_TABLES)[number];
