import type { ID } from '@/models/common';
import type { User } from '@/models/user';
import type { GlobeData } from '../globe/globeData';

/** What each feed card highlights about a traveler. */
export type FeedScope = 'city' | 'country' | 'airport';

/** `recent` = most recently visited first, `most` = most visited first. */
export type FeedSort = 'recent' | 'most';

export interface FeedFilter {
  scope: FeedScope;
  sort: FeedSort;
}

export const DEFAULT_FEED_FILTER: FeedFilter = { scope: 'city', sort: 'recent' };

/** The city / country / airport a card is about (the traveler's top pick for the filter). */
export interface FeedHighlight {
  scope: FeedScope;
  id: ID;
  /** `Tokyo`, `Japan`, `NRT` */
  label: string;
  /** `Japan`, `Narita International`, ... */
  sublabel: string;
  /** ISO 3166-1 alpha-2 for the flag. */
  isoCode: string;
  /** Number of visits (city/country) or flights (airport). */
  count: number;
  /** Most recent visit / flight date, `YYYY-MM-DD`. */
  lastDate: string;
  longitude: number;
  latitude: number;
}

export interface FeedStatsData {
  countries: number;
  cities: number;
  flights: number;
  totalDistanceKm: number;
}

export interface FeedCard {
  /** Stable list key. */
  key: string;
  user: User;
  globe: GlobeData;
  stats: FeedStatsData;
  highlight: FeedHighlight;
  /** Number used for ordering: timestamp for `recent`, count for `most`. */
  sortValue: number;
}
