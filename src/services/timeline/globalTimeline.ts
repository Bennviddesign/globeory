import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { Trip } from '@/models/trip';
import { describeCity } from '../data/lookup';
import { daysInclusive, yearOf } from '../util/dates';

export interface TimelineCountry {
  isoCode: string;
  name: string;
}

export interface TimelineTripItem {
  kind: 'trip';
  key: string;
  trip: Trip;
  days: number;
  countries: TimelineCountry[];
  cities: string[];
  coverImage: string | null;
  sortDate: string;
}

/** A destination visit that is not part of any trip. */
export interface TimelineVisitItem {
  kind: 'visit';
  key: string;
  visit: DestinationVisit;
  days: number;
  countries: TimelineCountry[];
  cities: string[];
  coverImage: string | null;
  sortDate: string;
}

export type TimelineItem = TimelineTripItem | TimelineVisitItem;

export interface TimelineYear {
  year: number;
  items: TimelineItem[];
}

/** Cover image of a trip: its own cover, else the image of its earliest visit that has one. */
export function tripCoverImage(db: Database, trip: Trip): string | null {
  if (trip.cover_image) return trip.cover_image;
  const visit = db.destination_visits
    .filter((v) => v.trip_id === trip.id && v.image_path)
    .sort((a, b) => a.visit_date.localeCompare(b.visit_date))[0];
  return visit?.image_path ?? null;
}

function uniqueCountries(db: Database, visits: DestinationVisit[]): TimelineCountry[] {
  const seen = new Map<ID, TimelineCountry>();
  for (const v of visits) {
    const d = describeCity(db, v.city_id);
    if (d.country && !seen.has(d.country.id)) {
      seen.set(d.country.id, { isoCode: d.country.iso_code, name: d.country.name });
    }
  }
  return [...seen.values()];
}

function uniqueCityNames(db: Database, visits: DestinationVisit[]): string[] {
  const ordered = [...visits].sort((a, b) => a.visit_date.localeCompare(b.visit_date));
  return [...new Set(ordered.map((v) => describeCity(db, v.city_id).cityName))];
}

/**
 * The global timeline (spec section 10): every trip and standalone visit,
 * grouped by year, newest first. Repeated visits to a city all appear.
 */
export function buildGlobalTimeline(db: Database, userId: ID): TimelineYear[] {
  const items: TimelineItem[] = [];

  for (const trip of db.trips.filter((t) => t.user_id === userId)) {
    const visits = db.destination_visits.filter((v) => v.trip_id === trip.id);
    items.push({
      kind: 'trip',
      key: `trip-${trip.id}`,
      trip,
      days: daysInclusive(trip.start_date, trip.end_date),
      countries: uniqueCountries(db, visits),
      cities: uniqueCityNames(db, visits),
      coverImage: tripCoverImage(db, trip),
      sortDate: trip.start_date,
    });
  }

  for (const visit of db.destination_visits.filter((v) => v.user_id === userId && !v.trip_id)) {
    items.push({
      kind: 'visit',
      key: `visit-${visit.id}`,
      visit,
      days: daysInclusive(visit.visit_date, visit.end_date ?? visit.visit_date),
      countries: uniqueCountries(db, [visit]),
      cities: uniqueCityNames(db, [visit]),
      coverImage: visit.image_path,
      sortDate: visit.visit_date,
    });
  }

  const byYear = new Map<number, TimelineItem[]>();
  for (const item of items) {
    const year = yearOf(item.sortDate);
    byYear.set(year, [...(byYear.get(year) ?? []), item]);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({
      year,
      items: list.sort((a, b) => b.sortDate.localeCompare(a.sortDate)),
    }));
}
