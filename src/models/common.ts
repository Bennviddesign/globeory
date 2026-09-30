/**
 * Shared primitive types used by every model.
 *
 * All models use snake_case field names on purpose: the local data model maps
 * 1:1 to the planned Supabase/PostgreSQL schema (spec sections 3 and 40).
 */

export type ID = string;

/** Calendar date, `YYYY-MM-DD`. */
export type ISODate = string;

/** Full timestamp, ISO 8601 (`2026-04-11T08:30:00.000Z`). */
export type ISODateTime = string;

/** Content visibility (spec section 27). */
export type Visibility = 'public' | 'followers' | 'private';

/** Profile visibility (spec section 26). */
export type ProfileVisibility = 'public' | 'private';

/** Display unit for distances. Kilometers are always the stored unit. */
export type DistanceUnit = 'km' | 'mi';

export const VISIBILITY_VALUES: readonly Visibility[] = ['public', 'followers', 'private'];

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: 'Public',
  followers: 'Followers',
  private: 'Private',
};

/** Fields every row gets when it is created by a service. */
export interface RowMeta {
  id: ID;
  created_at: ISODateTime;
}

/** Fields of rows that belong to a user. */
export interface OwnedRow extends RowMeta {
  user_id: ID;
}

/** Helper: strips server-managed fields so forms only deal with editable data. */
export type InputOf<T, Extra extends keyof T = never> = Omit<
  T,
  'id' | 'user_id' | 'created_at' | 'updated_at' | Extra
>;
