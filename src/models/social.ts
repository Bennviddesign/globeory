import type { ID, ISODateTime } from './common';

/** `follows` table. One-way: follower -> following. */
export interface Follow {
  id: ID;
  follower_id: ID;
  following_id: ID;
  created_at: ISODateTime;
}

export type NotificationType =
  | 'trip_added'
  | 'destination_added'
  | 'memory_added'
  | 'activity_added'
  | 'new_follower';

/** `notifications` table. */
export interface AppNotification {
  id: ID;
  recipient_id: ID;
  actor_id: ID;
  type: NotificationType;
  /** Id of the trip / visit / memory / activity / follower user the notification opens. */
  reference_id: ID;
  is_read: boolean;
  created_at: ISODateTime;
}

export interface NotificationPreferences {
  trips: boolean;
  destinations: boolean;
  memories: boolean;
  activities: boolean;
  followers: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  trips: true,
  destinations: true,
  memories: true,
  activities: true,
  followers: true,
};
