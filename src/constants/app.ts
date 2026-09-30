export const APP_NAME = 'Globeory';
export const APP_TAGLINE = 'Your world. Your story.';

/** Local storage layout. Keys are namespaced so demo and personal data never mix. */
export const STORAGE_PREFIX = 'globeory:v1';
export const STORAGE_KEYS = {
  session: `${STORAGE_PREFIX}:session`,
  settings: `${STORAGE_PREFIX}:settings`,
} as const;

export type DataNamespace = 'demo' | 'local';

/** Search results are paginated (spec sections 31 and 48). */
export const SEARCH_PAGE_SIZE = 5;

/** Demo Mode identity. */
export const DEMO_CURRENT_USER_ID = 'u_marcus';

/** Above this many markers the globe/map starts clustering. */
export const CLUSTER_THRESHOLD = 40;

/** Bump to re-seed the demo data (old demo data is replaced, personal data is never touched). */
export const DEMO_DATA_VERSION = 1;
export const LOCAL_DATA_VERSION = 1;
