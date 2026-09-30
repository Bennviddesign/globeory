import type { City } from '@/models/reference';
import { countryIdFor } from './countries';

/** [key, name, country iso, latitude, longitude] */
const RAW: readonly (readonly [string, string, string, number, number])[] = [
  // Sweden
  ['malmo', 'Malmö', 'SE', 55.605, 13.0038],
  ['stockholm', 'Stockholm', 'SE', 59.3293, 18.0686],
  ['gothenburg', 'Gothenburg', 'SE', 57.7089, 11.9746],
  // Denmark & Norway
  ['copenhagen', 'Copenhagen', 'DK', 55.6761, 12.5683],
  ['oslo', 'Oslo', 'NO', 59.9139, 10.7522],
  // Thailand
  ['bangkok', 'Bangkok', 'TH', 13.7563, 100.5018],
  ['kohsamui', 'Koh Samui', 'TH', 9.512, 100.0136],
  ['pattaya', 'Pattaya', 'TH', 12.9236, 100.8825],
  ['phuket', 'Phuket', 'TH', 7.8804, 98.3923],
  ['chiangmai', 'Chiang Mai', 'TH', 18.7883, 98.9853],
  // France
  ['paris', 'Paris', 'FR', 48.8566, 2.3522],
  ['nice', 'Nice', 'FR', 43.7102, 7.262],
  ['lyon', 'Lyon', 'FR', 45.764, 4.8357],
  // Italy
  ['milan', 'Milan', 'IT', 45.4642, 9.19],
  ['rome', 'Rome', 'IT', 41.9028, 12.4964],
  ['florence', 'Florence', 'IT', 43.7696, 11.2558],
  ['venice', 'Venice', 'IT', 45.4408, 12.3155],
  // Spain
  ['barcelona', 'Barcelona', 'ES', 41.3851, 2.1734],
  ['madrid', 'Madrid', 'ES', 40.4168, -3.7038],
  ['seville', 'Seville', 'ES', 37.3891, -5.9845],
  // Japan
  ['tokyo', 'Tokyo', 'JP', 35.6762, 139.6503],
  ['kyoto', 'Kyoto', 'JP', 35.0116, 135.7681],
  ['osaka', 'Osaka', 'JP', 34.6937, 135.5023],
  // South Korea
  ['seoul', 'Seoul', 'KR', 37.5665, 126.978],
  ['busan', 'Busan', 'KR', 35.1796, 129.0756],
  // Germany
  ['berlin', 'Berlin', 'DE', 52.52, 13.405],
  ['munich', 'Munich', 'DE', 48.1351, 11.582],
  ['frankfurt', 'Frankfurt', 'DE', 50.1109, 8.6821],
  // UK, Netherlands, Portugal, Greece
  ['london', 'London', 'GB', 51.5074, -0.1278],
  ['amsterdam', 'Amsterdam', 'NL', 52.3676, 4.9041],
  ['lisbon', 'Lisbon', 'PT', 38.7223, -9.1393],
  ['porto', 'Porto', 'PT', 41.1579, -8.6291],
  ['athens', 'Athens', 'GR', 37.9838, 23.7275],
  ['santorini', 'Santorini', 'GR', 36.3932, 25.4615],
  // Rest of the world
  ['newyork', 'New York', 'US', 40.7128, -74.006],
  ['losangeles', 'Los Angeles', 'US', 34.0522, -118.2437],
  ['dubai', 'Dubai', 'AE', 25.2048, 55.2708],
  ['singapore', 'Singapore', 'SG', 1.3521, 103.8198],
  ['istanbul', 'Istanbul', 'TR', 41.0082, 28.9784],
  ['sydney', 'Sydney', 'AU', -33.8688, 151.2093],
];

export const cityIdFor = (key: string) => `ci_${key}`;

export const CITIES: readonly City[] = RAW.map(([key, name, iso, latitude, longitude]) => ({
  id: cityIdFor(key),
  name,
  country_id: countryIdFor(iso),
  latitude,
  longitude,
}));
