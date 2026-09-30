import type { DistanceUnit } from '@/models/common';

/** Mean Earth radius in kilometers (IUGG). */
export const EARTH_RADIUS_KM = 6371.0088;
export const KM_PER_MILE = 1.609344;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Great-circle distance between two coordinates using the Haversine formula
 * (spec section 18). The result is in kilometers, the canonical stored unit.
 */
export function haversineKm(
  departureLat: number,
  departureLon: number,
  arrivalLat: number,
  arrivalLon: number,
): number {
  const dLat = toRadians(arrivalLat - departureLat);
  const dLon = toRadians(arrivalLon - departureLon);
  const lat1 = toRadians(departureLat);
  const lat2 = toRadians(arrivalLat);

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function kmToMiles(km: number): number {
  return km / KM_PER_MILE;
}

export function milesToKm(miles: number): number {
  return miles * KM_PER_MILE;
}

/** Converts a stored kilometer value into the unit the user wants to see. */
export function convertDistance(km: number, unit: DistanceUnit): number {
  return unit === 'mi' ? kmToMiles(km) : km;
}

/** `9 123 km` / `5 669 mi`. */
export function formatDistance(km: number, unit: DistanceUnit): string {
  const value = Math.round(convertDistance(km, unit));
  return `${value.toLocaleString('en-US')} ${unit}`;
}

/** Stored distances are rounded to 1 decimal so the value is stable across platforms. */
export function roundDistanceKm(km: number): number {
  return Math.round(km * 10) / 10;
}
