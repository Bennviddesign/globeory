import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { User } from '@/models/user';
import { followerCount, isFollowing } from '../social/followService';
import { canViewProfileContent, scopeToUser } from '../social/visibilityService';
import { computeStats } from '../stats/statsService';
import { normalizeText } from '../util/text';

export interface UserSearchResult {
  user: User;
  followers: number;
  countries: number;
  cities: number;
  isFollowing: boolean;
  isSelf: boolean;
}

/** Public counters of a user as seen by `viewerId` (only authorized content is counted). */
export function publicCounters(db: Database, user: User, viewerId: ID | null) {
  if (!canViewProfileContent(db, viewerId, user.id)) return { countries: 0, cities: 0 };
  const stats = computeStats(scopeToUser(db, user.id, viewerId), user.id);
  return { countries: stats.countries, cities: stats.cities };
}

function relevance(user: User, query: string): number {
  const username = normalizeText(user.username);
  const name = normalizeText(user.display_name);
  if (username === query) return 100;
  if (name === query) return 95;
  if (username.startsWith(query)) return 80;
  if (name.startsWith(query)) return 75;
  if (name.split(' ').some((part) => part.startsWith(query))) return 60;
  if (username.includes(query) || name.includes(query)) return 40;
  return 0;
}

/**
 * Username / display-name search (spec section 29). Private profiles are
 * findable by name (so they can be followed) but expose no content.
 */
export function searchUsers(
  db: Database,
  viewerId: ID | null,
  rawQuery: string,
): UserSearchResult[] {
  const query = normalizeText(rawQuery.replace(/^@/, ''));
  if (!query) return [];

  return db.users
    .map((user) => ({ user, score: relevance(user, query) }))
    .filter((x) => x.score > 0 && x.user.id !== viewerId)
    .map(({ user, score }) => ({
      score,
      result: {
        user,
        followers: followerCount(db, user.id),
        ...publicCounters(db, user, viewerId),
        isFollowing: viewerId ? isFollowing(db, viewerId, user.id) : false,
        isSelf: user.id === viewerId,
      } satisfies UserSearchResult,
    }))
    .sort((a, b) => b.score - a.score || b.result.followers - a.result.followers)
    .map((x) => x.result);
}
