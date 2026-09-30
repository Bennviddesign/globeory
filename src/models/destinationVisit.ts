import type { ID, ISODate, ISODateTime, Visibility } from './common';

/**
 * `destination_visits` table (spec sections 12, 13 and 41).
 *
 * A destination visit is ONE occurrence of visiting a city. Milan in 2023 and
 * Milan in 2026 are two separate rows that reference the same permanent
 * `cities` row.
 *
 * ONE-IMAGE RULE: `image_path` is a single nullable column, so a visit holds
 * zero or one representative image by construction. There is intentionally no
 * images array and no gallery table. The helpers below are the only way the
 * rest of the app reads or changes the image.
 */
export interface DestinationVisit {
  id: ID;
  user_id: ID;
  trip_id: ID | null;
  city_id: ID;
  country_id: ID;
  /** Display name of the visit, normally the city name. */
  name: string;
  visit_date: ISODate;
  /** Optional last day of the visit (used for "days" statistics). */
  end_date: ISODate | null;
  notes: string | null;
  /** 0 or 1 representative image (device file URI or remote URL). */
  image_path: string | null;
  visibility: Visibility;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export type DestinationVisitInput = Omit<
  DestinationVisit,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

/** Hard limit from the spec: maximum one image per destination visit. */
export const MAX_IMAGES_PER_VISIT = 1;

export function visitHasImage(visit: Pick<DestinationVisit, 'image_path'>): boolean {
  return typeof visit.image_path === 'string' && visit.image_path.length > 0;
}

/** Sets (replaces) the single representative image. */
export function withVisitImage<T extends { image_path: string | null }>(
  visit: T,
  imagePath: string,
): T {
  return { ...visit, image_path: imagePath };
}

/** Removes the representative image. */
export function withoutVisitImage<T extends { image_path: string | null }>(visit: T): T {
  return { ...visit, image_path: null };
}

/**
 * Normalizes any incoming value (legacy/corrupt data, future cloud payloads)
 * into the 0-or-1 image shape. If several images are supplied only the first
 * one survives.
 */
export function normalizeVisitImage(value: unknown): string | null {
  if (Array.isArray(value)) return normalizeVisitImage(value[0]);
  if (typeof value === 'string' && value.length > 0) return value;
  return null;
}
