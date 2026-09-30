import type { Airport, City, Country } from '@/models/reference';
import { AIRPORTS } from './airports';
import { CITIES } from './cities';
import { COUNTRIES } from './countries';

export { airportIdFor } from './airports';
export { cityIdFor } from './cities';
export { countryIdFor } from './countries';

export interface ReferenceData {
  countries: Country[];
  cities: City[];
  airports: Airport[];
}

/** Fresh copies of the static reference tables (they are never persisted). */
export function getReferenceData(): ReferenceData {
  return {
    countries: [...COUNTRIES],
    cities: [...CITIES],
    airports: [...AIRPORTS],
  };
}
