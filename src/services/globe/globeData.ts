import type { CategoryKey } from '@/constants/colors';
import type { GlobeFilter } from '@/constants/categories';
import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import { describeCity, getAirport, getCity } from '../data/lookup';
import { jitterCoordinate } from '../geo/jitter';
import { shapeForIsoCode } from '../geo/worldData';

export type MarkerRefType = 'city' | 'airport' | 'hotel' | 'place' | 'activity';

export interface GlobeMarker {
  id: string;
  category: CategoryKey;
  refType: MarkerRefType;
  /** Id of the city / airport / hotel / place / activity. */
  refId: ID;
  latitude: number;
  longitude: number;
  title: string;
  subtitle: string;
  /** For city markers: the ids of every separate visit. */
  visitIds: ID[];
}

export interface GlobeRoute {
  id: string;
  from: [number, number];
  to: [number, number];
  fromLabel: string;
  toLabel: string;
  flightIds: ID[];
  distanceKm: number;
}

export interface GlobeData {
  markers: GlobeMarker[];
  routes: GlobeRoute[];
  /** Shape ids (ISO numeric) of visited countries, for highlighting. */
  visitedIsoCodes: string[];
}

/** Hard cap so the globe never draws an unbounded number of arcs (spec section 48). */
const MAX_ROUTES = 120;

/**
 * Builds everything the globe/map needs from a (scoped) database.
 * The `filter` implements All | Flights | Hotels | Places | Activities.
 */
export function buildGlobeData(db: Database, userId: ID, filter: GlobeFilter): GlobeData {
  const show = (category: CategoryKey) => filter === 'all' || filter === category;
  const markers: GlobeMarker[] = [];
  const routes: GlobeRoute[] = [];

  const visits = db.destination_visits.filter((v) => v.user_id === userId);

  // Destination visits -> one marker per city (aggregating separate visits).
  if (show('place')) {
    const byCity = new Map<ID, ID[]>();
    for (const v of visits) byCity.set(v.city_id, [...(byCity.get(v.city_id) ?? []), v.id]);
    for (const [cityId, visitIds] of byCity) {
      const city = getCity(db, cityId);
      if (!city) continue;
      const label = describeCity(db, cityId);
      markers.push({
        id: `city-${cityId}`,
        category: 'place',
        refType: 'city',
        refId: cityId,
        latitude: city.latitude,
        longitude: city.longitude,
        title: city.name,
        subtitle: `${label.countryName} · ${visitIds.length} ${visitIds.length === 1 ? 'visit' : 'visits'}`,
        visitIds,
      });
    }
    for (const p of db.places.filter((x) => x.user_id === userId)) {
      markers.push({
        id: `place-${p.id}`,
        category: 'place',
        refType: 'place',
        refId: p.id,
        latitude: p.latitude,
        longitude: p.longitude,
        title: p.name,
        subtitle: describeCity(db, p.city_id).text,
        visitIds: [],
      });
    }
  }

  if (show('hotel')) {
    for (const h of db.hotels.filter((x) => x.user_id === userId)) {
      const city = getCity(db, h.city_id);
      if (!city) continue;
      const pos = jitterCoordinate(city.latitude, city.longitude, h.id);
      markers.push({
        id: `hotel-${h.id}`,
        category: 'hotel',
        refType: 'hotel',
        refId: h.id,
        latitude: pos.latitude,
        longitude: pos.longitude,
        title: h.name,
        subtitle: describeCity(db, h.city_id).text,
        visitIds: [],
      });
    }
  }

  if (show('activity')) {
    for (const a of db.activities.filter((x) => x.user_id === userId)) {
      markers.push({
        id: `activity-${a.id}`,
        category: 'activity',
        refType: 'activity',
        refId: a.id,
        latitude: a.latitude,
        longitude: a.longitude,
        title: a.name,
        subtitle: describeCity(db, a.city_id).text,
        visitIds: [],
      });
    }
  }

  if (show('flight')) {
    const flights = db.flights.filter((f) => f.user_id === userId);
    const airportCounts = new Map<ID, number>();
    const routeMap = new Map<string, GlobeRoute>();

    for (const f of flights) {
      const dep = getAirport(db, f.departure_airport_id);
      const arr = getAirport(db, f.arrival_airport_id);
      if (!dep || !arr) continue;
      airportCounts.set(dep.id, (airportCounts.get(dep.id) ?? 0) + 1);
      airportCounts.set(arr.id, (airportCounts.get(arr.id) ?? 0) + 1);

      // Identical airport pairs share one arc (either direction) to keep the globe light.
      const key = [dep.id, arr.id].sort().join('|');
      const existing = routeMap.get(key);
      if (existing) {
        existing.flightIds.push(f.id);
      } else {
        routeMap.set(key, {
          id: `route-${key}`,
          from: [dep.longitude, dep.latitude],
          to: [arr.longitude, arr.latitude],
          fromLabel: dep.iata_code,
          toLabel: arr.iata_code,
          flightIds: [f.id],
          distanceKm: f.distance_km,
        });
      }
    }
    routes.push(...[...routeMap.values()].slice(0, MAX_ROUTES));

    for (const [airportId, count] of airportCounts) {
      const airport = getAirport(db, airportId);
      if (!airport) continue;
      markers.push({
        id: `airport-${airportId}`,
        category: 'flight',
        refType: 'airport',
        refId: airportId,
        latitude: airport.latitude,
        longitude: airport.longitude,
        title: `${airport.iata_code} · ${airport.name}`,
        subtitle: `${count} ${count === 1 ? 'flight' : 'flights'}`,
        visitIds: [],
      });
    }
  }

  const visitedIsoCodes = [
    ...new Set(
      visits
        .map((v) => describeCity(db, v.city_id).isoCode)
        .map((iso) => shapeForIsoCode(iso)?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  return { markers, routes, visitedIsoCodes };
}
