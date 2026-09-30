import type { ID, InputOf, ISODate, ISODateTime, Visibility } from './common';

/** General locations such as landmarks, restaurants, beaches or museums. */
export type PlaceType =
  | 'landmark'
  | 'restaurant'
  | 'beach'
  | 'museum'
  | 'park'
  | 'viewpoint'
  | 'other';

export const PLACE_TYPES: readonly PlaceType[] = [
  'landmark',
  'restaurant',
  'beach',
  'museum',
  'park',
  'viewpoint',
  'other',
];

/** `places` table. */
export interface Place {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  name: string;
  city_id: ID;
  type: PlaceType;
  latitude: number;
  longitude: number;
  date: ISODate;
  notes: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
}

export type PlaceInput = InputOf<Place>;
