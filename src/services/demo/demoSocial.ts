import type { AppNotification, Follow, NotificationType } from '@/models/social';
import { daysAgoIso } from '../util/dates';

const follow = (follower: string, following: string, daysAgo: number): Follow => ({
  id: `follow_${follower}_${following}`,
  follower_id: follower,
  following_id: following,
  created_at: daysAgoIso(daysAgo),
});

/** One-way follows between the demo users. Marcus follows Anna, Kenji and Sofia. */
export const DEMO_FOLLOWS: Follow[] = [
  follow('u_marcus', 'u_anna', 400),
  follow('u_marcus', 'u_kenji', 300),
  follow('u_marcus', 'u_sofia', 120),
  follow('u_anna', 'u_marcus', 380),
  follow('u_kenji', 'u_marcus', 90),
  follow('u_mina', 'u_marcus', 6),
  follow('u_lukas', 'u_marcus', 2),
  follow('u_sofia', 'u_anna', 200),
  follow('u_mina', 'u_anna', 150),
  follow('u_mina', 'u_kenji', 100),
  follow('u_elin', 'u_anna', 60),
  follow('u_elin', 'u_kenji', 55),
  follow('u_kenji', 'u_anna', 250),
  follow('u_anna', 'u_kenji', 240),
  follow('u_lukas', 'u_anna', 30),
];

function notification(
  id: string,
  actor: string,
  type: NotificationType,
  referenceId: string,
  daysAgo: number,
  isRead = false,
): AppNotification {
  return {
    id,
    recipient_id: 'u_marcus',
    actor_id: actor,
    type,
    reference_id: referenceId,
    is_read: isRead,
    created_at: daysAgoIso(daysAgo),
  };
}

/** Example notifications for the demo user (spec sections 34 and 59). */
export const DEMO_NOTIFICATIONS: AppNotification[] = [
  notification('n_1', 'u_anna', 'trip_added', 't_anna_tokyo26', 3),
  notification('n_2', 'u_anna', 'destination_added', 'v_anna_tokyo26', 3),
  notification('n_3', 'u_kenji', 'memory_added', 'm_kenji_izakaya', 1),
  notification('n_4', 'u_sofia', 'activity_added', 'a_sofia_brera', 5),
  notification('n_5', 'u_mina', 'new_follower', 'u_mina', 6),
  notification('n_6', 'u_lukas', 'new_follower', 'u_lukas', 2),
  notification('n_7', 'u_kenji', 'destination_added', 'v_kenji_tokyo26', 9, true),
];
