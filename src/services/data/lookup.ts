import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { Airport, City, Country } from '@/models/reference';
import type { Trip } from '@/models/trip';
import type { User } from '@/models/user';

/** Id -> row maps for fast lookups. Built once per database snapshot. */
export interface DbIndex {
  countries: Map<ID, Country>;
  cities: Map<ID, City>;
  airports: Map<ID, Airport>;
  users: Map<ID, User>;
  trips: Map<ID, Trip>;
  visits: Map<ID, DestinationVisit>;
}

const cache = new WeakMap<Database, DbIndex>();

const toMap = <T extends { id: ID }>(rows: readonly T[]) => new Map(rows.map((r) => [r.id, r]));

export function indexOf(db: Database): DbIndex {
  let index = cache.get(db);
  if (!index) {
    index = {
      countries: toMap(db.countries),
      cities: toMap(db.cities),
      airports: toMap(db.airports),
      users: toMap(db.users),
      trips: toMap(db.trips),
      visits: toMap(db.destination_visits),
    };
    cache.set(db, index);
  }
  return index;
}

export const getCountry = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).countries.get(id) : undefined;
export const getCity = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).cities.get(id) : undefined;
export const getAirport = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).airports.get(id) : undefined;
export const getUser = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).users.get(id) : undefined;
export const getTrip = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).trips.get(id) : undefined;
export const getVisit = (db: Database, id: ID | null | undefined) =>
  id ? indexOf(db).visits.get(id) : undefined;

export interface CityLabel {
  city: City | undefined;
  country: Country | undefined;
  /** `Paris, France` */
  text: string;
  cityName: string;
  countryName: string;
  isoCode: string;
}

/** City + country information in display form. */
export function describeCity(db: Database, cityId: ID | null | undefined): CityLabel {
  const city = getCity(db, cityId);
  const country = getCountry(db, city?.country_id);
  const cityName = city?.name ?? 'Unknown city';
  const countryName = country?.name ?? '';
  return {
    city,
    country,
    cityName,
    countryName,
    isoCode: country?.iso_code ?? '',
    text: countryName ? `${cityName}, ${countryName}` : cityName,
  };
}
