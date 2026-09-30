import type { ID, Visibility } from '@/models/common';
import type { Database } from '@/models/database';
import type { AppNotification, NotificationPreferences, NotificationType } from '@/models/social';
import { getTrip, getUser, getVisit } from '../data/lookup';
import { insertInto } from '../data/tables';
import { newId } from '../util/id';
import { nowIso } from '../util/dates';

interface NewNotification {
  recipientId: ID;
  actorId: ID;
  type: NotificationType;
  referenceId: ID;
}

export function createNotification(db: Database, input: NewNotification): Database {
  const row: AppNotification = {
    id: newId('notif'),
    recipient_id: input.recipientId,
    actor_id: input.actorId,
    type: input.type,
    reference_id: input.referenceId,
    is_read: false,
    created_at: nowIso(),
  };
  return insertInto(db, 'notifications', row);
}

/**
 * Creates one notification for every follower who is allowed to see the new
 * content (spec section 59). Private content never notifies anyone.
 */
export function notifyFollowers(
  db: Database,
  actorId: ID,
  type: NotificationType,
  referenceId: ID,
  visibility: Visibility,
): Database {
  if (visibility === 'private') return db;
  return db.follows
    .filter((f) => f.following_id === actorId)
    .reduce(
      (acc, f) =>
        createNotification(acc, {
          recipientId: f.follower_id,
          actorId,
          type,
          referenceId,
        }),
      db,
    );
}

const PREFERENCE_FOR_TYPE: Record<NotificationType, keyof NotificationPreferences> = {
  trip_added: 'trips',
  destination_added: 'destinations',
  memory_added: 'memories',
  activity_added: 'activities',
  new_follower: 'followers',
};

/** Notifications for a user, newest first, filtered by their notification settings. */
export function listNotifications(
  db: Database,
  userId: ID,
  preferences: NotificationPreferences,
): AppNotification[] {
  return db.notifications
    .filter((n) => n.recipient_id === userId && preferences[PREFERENCE_FOR_TYPE[n.type]])
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function unreadCount(
  db: Database,
  userId: ID,
  preferences: NotificationPreferences,
): number {
  return listNotifications(db, userId, preferences).filter((n) => !n.is_read).length;
}

export function markNotificationRead(db: Database, id: ID): Database {
  return {
    ...db,
    notifications: db.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
  };
}

export function markAllNotificationsRead(db: Database, userId: ID): Database {
  return {
    ...db,
    notifications: db.notifications.map((n) =>
      n.recipient_id === userId ? { ...n, is_read: true } : n,
    ),
  };
}

export interface NotificationView {
  id: ID;
  actorName: string;
  actorId: ID;
  message: string;
  /** Route the notification opens (spec section 34). */
  href: string;
  isRead: boolean;
  createdAt: string;
  type: NotificationType;
}

/** Turns a notification row into display text + the destination route. */
export function describeNotification(db: Database, n: AppNotification): NotificationView {
  const actor = getUser(db, n.actor_id);
  const actorName = actor?.display_name ?? 'Someone';
  let message = '';
  let href = `/profile/${n.actor_id}`;

  switch (n.type) {
    case 'trip_added': {
      const trip = getTrip(db, n.reference_id);
      message = `${actorName} added a trip${trip ? `: ${trip.title}` : ''}`;
      href = `/trip/${n.reference_id}`;
      break;
    }
    case 'destination_added': {
      const visit = getVisit(db, n.reference_id);
      message = `${actorName} added a destination${visit ? `: ${visit.name}` : ''}`;
      href = `/visit/${n.reference_id}`;
      break;
    }
    case 'memory_added':
      message = `${actorName} added a memory`;
      href = `/profile/${n.actor_id}`;
      break;
    case 'activity_added':
      message = `${actorName} added an activity`;
      href = `/profile/${n.actor_id}`;
      break;
    case 'new_follower':
      message = `${actorName} started following you`;
      href = `/profile/${n.actor_id}`;
      break;
  }

  return {
    id: n.id,
    actorId: n.actor_id,
    actorName,
    message,
    href,
    isRead: n.is_read,
    createdAt: n.created_at,
    type: n.type,
  };
}
