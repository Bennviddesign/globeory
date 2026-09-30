import type { CategoryKey } from '@/constants/colors';
import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import { ACTIVITY_TYPE_LABELS } from '@/constants/categories';
import { describeCity, getAirport } from '../data/lookup';
import { formatTime } from '../util/dates';

export type TripEntryKind =
  | 'flight'
  | 'hotel_check_in'
  | 'hotel_check_out'
  | 'visit'
  | 'place'
  | 'activity'
  | 'memory';

export interface TripTimelineEntry {
  key: string;
  kind: TripEntryKind;
  /** Calendar date `YYYY-MM-DD`. */
  date: string;
  /** Sort key: date plus time when known. */
  sortKey: string;
  title: string;
  subtitle: string | null;
  category: CategoryKey | 'memory' | 'visit';
  icon: string;
  /** Route that opens the entry. */
  href: string;
}

/**
 * Entries of one trip, automatically sorted by date/time (spec section 11):
 * `11 Apr ✈ Copenhagen → Bangkok`, `11 Apr 🏨 Hotel check-in`, ...
 */
export function buildTripTimeline(db: Database, tripId: ID): TripTimelineEntry[] {
  const entries: TripTimelineEntry[] = [];

  for (const f of db.flights.filter((x) => x.trip_id === tripId)) {
    const dep = getAirport(db, f.departure_airport_id);
    const arr = getAirport(db, f.arrival_airport_id);
    entries.push({
      key: `flight-${f.id}`,
      kind: 'flight',
      date: f.departure_datetime.slice(0, 10),
      sortKey: f.departure_datetime,
      title: `${describeCity(db, dep?.city_id).cityName} → ${describeCity(db, arr?.city_id).cityName}`,
      subtitle: [`${dep?.iata_code ?? '?'} → ${arr?.iata_code ?? '?'}`, formatTime(f.departure_datetime)]
        .filter(Boolean)
        .join(' · '),
      category: 'flight',
      icon: 'airplane',
      href: `/flight/${f.id}`,
    });
  }

  for (const h of db.hotels.filter((x) => x.trip_id === tripId)) {
    const city = describeCity(db, h.city_id).cityName;
    entries.push({
      key: `hotel-in-${h.id}`,
      kind: 'hotel_check_in',
      date: h.check_in,
      sortKey: `${h.check_in}T14:00`,
      title: `Hotel check-in · ${h.name}`,
      subtitle: city,
      category: 'hotel',
      icon: 'bed',
      href: `/form/hotel?id=${h.id}`,
    });
    entries.push({
      key: `hotel-out-${h.id}`,
      kind: 'hotel_check_out',
      date: h.check_out,
      sortKey: `${h.check_out}T11:00`,
      title: `Hotel check-out · ${h.name}`,
      subtitle: city,
      category: 'hotel',
      icon: 'bed-outline',
      href: `/form/hotel?id=${h.id}`,
    });
  }

  for (const v of db.destination_visits.filter((x) => x.trip_id === tripId)) {
    entries.push({
      key: `visit-${v.id}`,
      kind: 'visit',
      date: v.visit_date,
      sortKey: `${v.visit_date}T00:00`,
      title: v.name,
      subtitle: describeCity(db, v.city_id).countryName,
      category: 'visit',
      icon: 'location',
      href: `/visit/${v.id}`,
    });
  }

  for (const p of db.places.filter((x) => x.trip_id === tripId)) {
    entries.push({
      key: `place-${p.id}`,
      kind: 'place',
      date: p.date,
      sortKey: `${p.date}T12:00`,
      title: p.name,
      subtitle: describeCity(db, p.city_id).cityName,
      category: 'place',
      icon: 'pin',
      href: `/form/place?id=${p.id}`,
    });
  }

  for (const a of db.activities.filter((x) => x.trip_id === tripId)) {
    entries.push({
      key: `activity-${a.id}`,
      kind: 'activity',
      date: a.date,
      sortKey: `${a.date}T13:00`,
      title: a.name,
      subtitle: `${ACTIVITY_TYPE_LABELS[a.type]} · ${describeCity(db, a.city_id).cityName}`,
      category: 'activity',
      icon: 'walk',
      href: `/form/activity?id=${a.id}`,
    });
  }

  for (const m of db.memories.filter((x) => x.trip_id === tripId)) {
    entries.push({
      key: `memory-${m.id}`,
      kind: 'memory',
      date: m.date,
      sortKey: `${m.date}T20:00`,
      title: m.title,
      subtitle: m.city_id ? describeCity(db, m.city_id).cityName : null,
      category: 'memory',
      icon: 'heart',
      href: `/form/memory?id=${m.id}`,
    });
  }

  return entries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}
