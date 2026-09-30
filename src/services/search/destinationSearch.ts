import { SEARCH_PAGE_SIZE } from '@/constants/app';
import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { City, Country } from '@/models/reference';
import type { User } from '@/models/user';
import { getCountry, getUser } from '../data/lookup';
import { followerCount, isFollowing } from '../social/followService';
import { normalizeText } from '../util/text';
import { publicCounters } from './userSearch';

export type DestinationSort = 'relevance' | 'recent' | 'followers' | 'destinations';

export const DESTINATION_SORTS: readonly { key: DestinationSort; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'recent', label: 'Recently added' },
  { key: 'followers', label: 'Most followers' },
  { key: 'destinations', label: 'Most destinations' },
];

/**
 * One person who has actually RECORDED the searched destination (a real
 * destination visit entry), not someone who merely mentions it in a bio.
 */
export interface DestinationResult {
  user: User;
  city: City;
  country: Country | undefined;
  /** Number of matching visit entries this user recorded. */
  matchingVisits: number;
  /** When the most recent matching visit was added (`created_at`). */
  lastAddedAt: string;
  followers: number;
  countries: number;
  cities: number;
  destinationCount: number;
  isFollowing: boolean;
  isSelf: boolean;
  score: number;
}

export interface DestinationSearchPage {
  results: DestinationResult[];
  total: number;
  page: number;
  hasMore: boolean;
}

function matchScore(cityName: string, countryName: string, query: string): number {
  const city = normalizeText(cityName);
  const country = normalizeText(countryName);
  if (city === query) return 100;
  if (city.startsWith(query)) return 70;
  if (city.includes(query)) return 45;
  if (country === query) return 30;
  return 0;
}

/**
 * Privacy rules of spec section 32 (mirrors the RLS the backend will enforce):
 *  - private profiles are excluded from public destination discovery
 *  - private visits are excluded
 *  - followers-only visits only for eligible followers (or the owner)
 */
function isDiscoverable(db: Database, viewerId: ID | null, visit: DestinationVisit): boolean {
  const owner = getUser(db, visit.user_id);
  if (!owner || owner.profile_visibility !== 'public') return false;
  if (visit.visibility === 'public') return true;
  if (visit.visibility === 'followers') {
    return viewerId === owner.id || (viewerId ? isFollowing(db, viewerId, owner.id) : false);
  }
  return false;
}

export function searchDestinations(
  db: Database,
  viewerId: ID | null,
  rawQuery: string,
  sort: DestinationSort,
  page = 0,
  pageSize: number = SEARCH_PAGE_SIZE,
): DestinationSearchPage {
  const query = normalizeText(rawQuery);
  if (!query) return { results: [], total: 0, page, hasMore: false };

  const cityById = new Map(db.cities.map((c) => [c.id, c]));
  const grouped = new Map<string, { visits: DestinationVisit[]; city: City; score: number }>();

  for (const visit of db.destination_visits) {
    const city = cityById.get(visit.city_id);
    if (!city) continue;
    const score = matchScore(city.name, getCountry(db, city.country_id)?.name ?? '', query);
    if (score === 0 || !isDiscoverable(db, viewerId, visit)) continue;
    const key = `${visit.user_id}|${city.id}`;
    const entry = grouped.get(key);
    if (entry) entry.visits.push(visit);
    else grouped.set(key, { visits: [visit], city, score });
  }

  const results: DestinationResult[] = [];
  for (const { visits, city, score } of grouped.values()) {
    const user = getUser(db, visits[0].user_id);
    if (!user || user.id === viewerId) continue; // discovery is about other travelers
    const counters = publicCounters(db, user, viewerId);
    results.push({
      user,
      city,
      country: getCountry(db, city.country_id),
      matchingVisits: visits.length,
      lastAddedAt: visits.map((v) => v.created_at).sort().reverse()[0],
      followers: followerCount(db, user.id),
      ...counters,
      destinationCount: new Set(
        db.destination_visits.filter((v) => v.user_id === user.id).map((v) => v.city_id),
      ).size,
      isFollowing: viewerId ? isFollowing(db, viewerId, user.id) : false,
      isSelf: user.id === viewerId,
      score,
    });
  }

  const tieBreak = (a: DestinationResult, b: DestinationResult) =>
    a.user.username.localeCompare(b.user.username);

  results.sort((a, b) => {
    switch (sort) {
      case 'recent':
        return b.lastAddedAt.localeCompare(a.lastAddedAt) || tieBreak(a, b);
      case 'followers':
        return b.followers - a.followers || tieBreak(a, b);
      case 'destinations':
        return b.destinationCount - a.destinationCount || tieBreak(a, b);
      case 'relevance':
      default:
        // Deterministic: match quality, then number of matching visits, then followers.
        return (
          b.score - a.score ||
          b.matchingVisits - a.matchingVisits ||
          b.followers - a.followers ||
          tieBreak(a, b)
        );
    }
  });

  const start = page * pageSize;
  const slice = results.slice(0, start + pageSize);
  return { results: slice, total: results.length, page, hasMore: start + pageSize < results.length };
}
