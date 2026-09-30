import type { ID, InputOf, ISODate, ISODateTime, Visibility } from './common';

/** `trips` table. A trip groups related travel entries into one larger event. */
export interface Trip {
  id: ID;
  user_id: ID;
  title: string;
  description: string | null;
  start_date: ISODate;
  end_date: ISODate;
  cover_image: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type TripInput = InputOf<Trip>;
