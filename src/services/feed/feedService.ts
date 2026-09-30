import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { User } from '@/models/user';
import { getAirport, getCity, getCountry } from '../data/lookup';
import { buildGlobeData } from '../globe/globeData';
import { canViewProfileContent, scopeToUser } from '../social/visibilityService';
import { computeStats } from '../stats/statsService';
import type { FeedCard, FeedFilter, FeedHighlight, FeedScope } from './feedTypes';

interface Tally {
  highlight: Omit<FeedHighlight, 'count' | 'lastDate'>;
  count: number;
  lastDate: string;
}

function bump(map: Map<ID, Tally>, id: ID, date: string, make: () => Tally['highlight'] | null) {
  const existing = map.get(id);
  if (existing) {
    existing.count += 1;
    if (date > existing.lastDate) existing.lastDate = date;
    return;
  }
  const highlight = make();
  if (highlight) map.set(id, { highlight, count: 1, lastDate: date });
}

/** Visits / flights of one user grouped by city, country or airport. */
function tally(scoped: Database, userId: ID, scope: FeedScope): Tally[] {
  const map = new Map<ID, Tally>();

  if (scope === 'airport') {
    for (const f of scoped.flights) {
      if (f.user_id !== userId) continue;
      const date = f.departure_datetime.slice(0, 10);
      for (const airportId of [f.departure_airport_id, f.arrival_airport_id]) {
        bump(map, airportId, date, () => {
          const airport = getAirport(scoped, airportId);
          if (!airport) return null;
          const city = getCity(scoped, airport.city_id);
          return {
            scope,
            id: airport.id,
            label: airport.iata_code,
            sublabel: airport.name,
            isoCode: getCountry(scoped, city?.country_id)?.iso_code ?? '',
            longitude: airport.longitude,
            latitude: airport.latitude,
          };
        });
      }
    }
    return [...map.values()];
  }

  for (const v of scoped.destination_visits) {
    if (v.user_id !== userId) continue;
    const id = scope === 'city' ? v.city_id : v.country_id;
    bump(map, id, v.end_date ?? v.visit_date, () => {
      const city = getCity(scoped, v.city_id);
      const country = getCountry(scoped, v.country_id);
      if (scope === 'city') {
        if (!city) return null;
        return {
          scope,
          id: city.id,
          label: city.name,
          sublabel: country?.name ?? '',
          isoCode: country?.iso_code ?? '',
          longitude: city.longitude,
          latitude: city.latitude,
        };
      }
      if (!country) return null;
      return {
        scope,
        id: country.id,
        label: country.name,
        sublabel: '',
        isoCode: country.iso_code,
        longitude: country.longitude,
        latitude: country.latitude,
      };
    });
  }
  return [...map.values()];
}

/** The entry a card highlights: the most recent one, or the most visited one (ties: most recent). */
function pickHighlight(entries: Tally[], sort: FeedFilter['sort']): Tally | null {
  let best: Tally | null = null;
  for (const e of entries) {
    if (!best) {
      best = e;
      continue;
    }
    const byRecent = e.lastDate.localeCompare(best.lastDate);
    const byCount = e.count - best.count;
    const better = sort === 'recent' ? byRecent > 0 || (byRecent === 0 && byCount > 0) : byCount > 0 || (byCount === 0 && byRecent > 0);
    if (better) best = e;
  }
  return best;
}

function toCard(db: Database, viewerId: ID | null, user: User, filter: FeedFilter): FeedCard | null {
  if (!canViewProfileContent(db, viewerId, user.id)) return null;

  // Everything below reads the permission-filtered copy, never the raw database.
  const scoped = scopeToUser(db, user.id, viewerId);
  const top = pickHighlight(tally(scoped, user.id, filter.scope), filter.sort);
  if (!top) return null;

  const stats = computeStats(scoped, user.id);
  return {
    key: `${user.id}|${filter.scope}`,
    user,
    globe: buildGlobeData(scoped, user.id, 'all'),
    stats: {
      countries: stats.countries,
      cities: stats.cities,
      flights: stats.flights,
      totalDistanceKm: stats.totalDistanceKm,
    },
    highlight: { ...top.highlight, count: top.count, lastDate: top.lastDate },
    sortValue: filter.sort === 'recent' ? Date.parse(top.lastDate) || 0 : top.count,
  };
}

/**
 * The social feed: one card per other traveler whose content the viewer may
 * see. Purely about places, with no likes, comments or follower counts.
 * Order is stable: sort value, then last date, then username.
 */
export function buildFeed(db: Database, viewerId: ID | null, filter: FeedFilter): FeedCard[] {
  const cards: FeedCard[] = [];
  for (const user of db.users) {
    if (user.id === viewerId) continue;
    const card = toCard(db, viewerId, user, filter);
    if (card) cards.push(card);
  }
  return cards.sort(
    (a, b) =>
      b.sortValue - a.sortValue ||
      b.highlight.lastDate.localeCompare(a.highlight.lastDate) ||
      a.user.username.localeCompare(b.user.username),
  );
}
