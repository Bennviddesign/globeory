import type { Country } from '@/models/reference';

/** [iso, name, latitude, longitude] */
const RAW: readonly (readonly [string, string, number, number])[] = [
  ['SE', 'Sweden', 62.0, 15.0],
  ['DK', 'Denmark', 56.0, 10.0],
  ['NO', 'Norway', 61.0, 8.5],
  ['TH', 'Thailand', 15.87, 100.99],
  ['FR', 'France', 46.6, 2.2],
  ['IT', 'Italy', 42.8, 12.6],
  ['ES', 'Spain', 40.2, -3.7],
  ['JP', 'Japan', 36.2, 138.25],
  ['KR', 'South Korea', 36.5, 127.8],
  ['DE', 'Germany', 51.2, 10.4],
  ['GB', 'United Kingdom', 54.0, -2.5],
  ['NL', 'Netherlands', 52.1, 5.3],
  ['PT', 'Portugal', 39.4, -8.2],
  ['GR', 'Greece', 39.0, 22.0],
  ['US', 'United States', 39.8, -98.6],
  ['AE', 'United Arab Emirates', 24.0, 54.0],
  ['SG', 'Singapore', 1.35, 103.82],
  ['TR', 'Turkey', 39.0, 35.2],
  ['AU', 'Australia', -25.3, 133.8],
];

export const countryIdFor = (iso: string) => `co_${iso}`;

export const COUNTRIES: readonly Country[] = RAW.map(([iso, name, latitude, longitude]) => ({
  id: countryIdFor(iso),
  name,
  iso_code: iso,
  latitude,
  longitude,
}));
