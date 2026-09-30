import type { DistanceUnit, ID, ISODateTime, ProfileVisibility } from './common';

/** `users` table (spec section 40). */
export interface User {
  id: ID;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  home_country: string | null;
  profile_visibility: ProfileVisibility;
  preferred_unit: DistanceUnit;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
