import type { ID, Visibility } from '@/models/common';
import type { Database } from '@/models/database';
import { getUser } from '../data/lookup';
import { isFollowing } from './followService';

/**
 * Can `viewerId` see content owned by `ownerId` with the given visibility?
 *
 * - Owners always see their own content.
 * - Private profiles: only followers may see anything at all.
 * - Content visibility then applies: public / followers / private.
 *
 * NOTE: in the cloud version this exact logic lives in Supabase RLS policies
 * and the backend filters rows before they reach the client (spec section 42).
 */
export function canView(
  db: Database,
  viewerId: ID | null,
  ownerId: ID,
  visibility: Visibility,
): boolean {
  if (viewerId && viewerId === ownerId) return true;
  const owner = getUser(db, ownerId);
  if (!owner) return false;
  const follower = viewerId ? isFollowing(db, viewerId, ownerId) : false;
  if (owner.profile_visibility === 'private' && !follower) return false;
  switch (visibility) {
    case 'public':
      return true;
    case 'followers':
      return follower;
    case 'private':
      return false;
  }
}

/** Can the viewer see anything of this profile's content (beyond the header)? */
export function canViewProfileContent(db: Database, viewerId: ID | null, ownerId: ID): boolean {
  if (viewerId && viewerId === ownerId) return true;
  const owner = getUser(db, ownerId);
  if (!owner) return false;
  if (owner.profile_visibility === 'public') return true;
  return viewerId ? isFollowing(db, viewerId, ownerId) : false;
}

/**
 * Returns a database that contains ONLY the rows of `ownerId` that `viewerId`
 * is authorized to see (plus the shared reference tables).
 *
 * Every view of another person's data (public profile, their globe, their
 * timeline, their statistics) is computed from this scoped database, so the
 * permission check cannot be forgotten by an individual screen.
 */
export function scopeToUser(db: Database, ownerId: ID, viewerId: ID | null): Database {
  const visible = <T extends { user_id: ID; visibility: Visibility }>(rows: readonly T[]) =>
    rows.filter((row) => row.user_id === ownerId && canView(db, viewerId, ownerId, row.visibility));

  return {
    ...db,
    users: db.users.filter((u) => u.id === ownerId),
    trips: visible(db.trips),
    flights: visible(db.flights),
    destination_visits: visible(db.destination_visits),
    hotels: visible(db.hotels),
    places: visible(db.places),
    activities: visible(db.activities),
    memories: visible(db.memories),
    follows: [],
    notifications: [],
  };
}
