import type { ActivityType } from '@/models/activity';
import type { PlaceType } from '@/models/place';
import type { CategoryKey } from './colors';

export type IconName = string;

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  flight: 'Flights',
  hotel: 'Hotels',
  place: 'Places',
  activity: 'Activities',
};

export const CATEGORY_ICONS: Record<CategoryKey, IconName> = {
  flight: 'airplane',
  hotel: 'bed',
  place: 'location',
  activity: 'walk',
};

/** Globe filter options (spec section 7): All | Flights | Hotels | Places | Activities. */
export type GlobeFilter = 'all' | CategoryKey;

export const GLOBE_FILTERS: readonly { key: GlobeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'flight', label: 'Flights' },
  { key: 'hotel', label: 'Hotels' },
  { key: 'place', label: 'Places' },
  { key: 'activity', label: 'Activities' },
];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  sightseeing: 'Sightseeing',
  adventure: 'Adventure',
  beach: 'Beach',
  food: 'Food',
  shopping: 'Shopping',
  culture: 'Culture',
  nature: 'Nature',
  nightlife: 'Nightlife',
  sport: 'Sport',
  other: 'Other',
};

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  landmark: 'Landmark',
  restaurant: 'Restaurant',
  beach: 'Beach',
  museum: 'Museum',
  park: 'Park',
  viewpoint: 'Viewpoint',
  other: 'Other',
};
