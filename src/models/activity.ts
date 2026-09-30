import type { ID, InputOf, ISODate, ISODateTime, Visibility } from './common';

/** Activity categories (spec section 21). */
export type ActivityType =
  | 'sightseeing'
  | 'adventure'
  | 'beach'
  | 'food'
  | 'shopping'
  | 'culture'
  | 'nature'
  | 'nightlife'
  | 'sport'
  | 'other';

export const ACTIVITY_TYPES: readonly ActivityType[] = [
  'sightseeing',
  'adventure',
  'beach',
  'food',
  'shopping',
  'culture',
  'nature',
  'nightlife',
  'sport',
  'other',
];

/** `activities` table. Activities describe things the user did. */
export interface Activity {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  name: string;
  city_id: ID;
  type: ActivityType;
  latitude: number;
  longitude: number;
  date: ISODate;
  description: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
}

export type ActivityInput = InputOf<Activity>;
