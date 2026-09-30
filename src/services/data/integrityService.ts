import type { Database } from '@/models/database';
import { normalizeVisitImage } from '@/models/destinationVisit';
import { recalculateFlightDistances } from './flightService';

/**
 * Runs whenever a database is loaded from storage (or, later, from the cloud).
 * Guarantees the invariants that the data model promises:
 *
 *  1. A destination visit has 0 or 1 image (never an array / gallery).
 *  2. A hotel has 0 or 1 image.
 *  3. Every flight distance equals the Haversine distance of its airports.
 *  4. The country of a visit always matches the country of its city.
 */
export function enforceInvariants(db: Database): Database {
  const cityCountry = new Map(db.cities.map((c) => [c.id, c.country_id]));

  const destination_visits = db.destination_visits.map((visit) => {
    const image_path = normalizeVisitImage(visit.image_path as unknown);
    const country_id = cityCountry.get(visit.city_id) ?? visit.country_id;
    if (image_path === visit.image_path && country_id === visit.country_id) return visit;
    return { ...visit, image_path, country_id };
  });

  const hotels = db.hotels.map((hotel) => {
    const image_path = normalizeVisitImage(hotel.image_path as unknown);
    return image_path === hotel.image_path ? hotel : { ...hotel, image_path };
  });

  return recalculateFlightDistances({ ...db, destination_visits, hotels });
}
