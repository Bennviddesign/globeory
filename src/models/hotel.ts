import type { ID, InputOf, ISODate, ISODateTime, Visibility } from './common';

/** `hotels` table. A hotel may optionally have one representative image. */
export interface Hotel {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  name: string;
  city_id: ID;
  address: string | null;
  check_in: ISODate;
  check_out: ISODate;
  image_path: string | null;
  notes: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
}

export type HotelInput = InputOf<Hotel>;
