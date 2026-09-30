import type { ID, InputOf, ISODate, ISODateTime, Visibility } from './common';

/**
 * `memories` table. A personal note linked to a trip and optionally a
 * location/date. Memories are intentionally text-only and separate from the
 * one-image-per-visit rule.
 */
export interface Memory {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  title: string;
  description: string | null;
  city_id: ID | null;
  date: ISODate;
  visibility: Visibility;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type MemoryInput = InputOf<Memory>;
