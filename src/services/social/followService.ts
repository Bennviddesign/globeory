import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Follow } from '@/models/social';
import { insertInto, type Mutation } from '../data/tables';
import { newId } from '../util/id';
import { nowIso } from '../util/dates';
import { createNotification } from './notificationService';

export function isFollowing(db: Database, followerId: ID, followingId: ID): boolean {
  return db.follows.some((f) => f.follower_id === followerId && f.following_id === followingId);
}

export function followerCount(db: Database, userId: ID): number {
  return db.follows.filter((f) => f.following_id === userId).length;
}

export function followingCount(db: Database, userId: ID): number {
  return db.follows.filter((f) => f.follower_id === userId).length;
}

export function followerIds(db: Database, userId: ID): ID[] {
  return db.follows.filter((f) => f.following_id === userId).map((f) => f.follower_id);
}

export function followingIds(db: Database, userId: ID): ID[] {
  return db.follows.filter((f) => f.follower_id === userId).map((f) => f.following_id);
}

/** One-way follow. Following yourself or twice is a no-op. Notifies the followed user. */
export function follow(db: Database, followerId: ID, followingId: ID): Mutation<Follow | null> {
  if (followerId === followingId || isFollowing(db, followerId, followingId)) {
    return { db, result: null };
  }
  const row: Follow = {
    id: newId('follow'),
    follower_id: followerId,
    following_id: followingId,
    created_at: nowIso(),
  };
  const next = insertInto(db, 'follows', row);
  return {
    db: createNotification(next, {
      recipientId: followingId,
      actorId: followerId,
      type: 'new_follower',
      referenceId: followerId,
    }),
    result: row,
  };
}

export function unfollow(db: Database, followerId: ID, followingId: ID): Database {
  return {
    ...db,
    follows: db.follows.filter(
      (f) => !(f.follower_id === followerId && f.following_id === followingId),
    ),
  };
}
