import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { DestinationVisit } from '@/models/destinationVisit';
import type { City, Country } from '@/models/reference';
import { getCity, getCountry } from '../data/lookup';
import { daysInclusive } from '../util/dates';

export interface CityAggregate {
  city: City;
  country: Country | undefined;
  /** Every separate visit, newest first. Repeated visits stay distinct. */
  visits: DestinationVisit[];
  totalDays: number;
  lastVisitDate: string;
}

export interface CountryAggregate {
  country: Country;
  cities: CityAggregate[];
  visitCount: number;
  totalDays: number;
  hotels: number;
  activities: number;
  flights: number;
  lastVisitDate: string;
}

const visitDays = (v: DestinationVisit) => daysInclusive(v.visit_date, v.end_date ?? v.visit_date);

/** Aggregates the user's visits per city (Places > Cities, City detail). */
export function aggregateCities(db: Database, userId: ID): CityAggregate[] {
  const byCity = new Map<ID, DestinationVisit[]>();
  for (const v of db.destination_visits) {
    if (v.user_id !== userId) continue;
    byCity.set(v.city_id, [...(byCity.get(v.city_id) ?? []), v]);
  }
  const result: CityAggregate[] = [];
  for (const [cityId, list] of byCity) {
    const city = getCity(db, cityId);
    if (!city) continue;
    const visits = [...list].sort((a, b) => b.visit_date.localeCompare(a.visit_date));
    result.push({
      city,
      country: getCountry(db, city.country_id),
      visits,
      totalDays: visits.reduce((sum, v) => sum + visitDays(v), 0),
      lastVisitDate: visits[0].visit_date,
    });
  }
  return result.sort((a, b) => b.lastVisitDate.localeCompare(a.lastVisitDate));
}

/** Aggregates per country (Places > Countries, Country detail). */
export function aggregateCountries(db: Database, userId: ID): CountryAggregate[] {
  const cities = aggregateCities(db, userId);
  const byCountry = new Map<ID, CityAggregate[]>();
  for (const c of cities) {
    byCountry.set(c.city.country_id, [...(byCountry.get(c.city.country_id) ?? []), c]);
  }
  const cityCountry = (cityId: ID) => getCity(db, cityId)?.country_id;

  const result: CountryAggregate[] = [];
  for (const [countryId, list] of byCountry) {
    const country = getCountry(db, countryId);
    if (!country) continue;
    result.push({
      country,
      cities: list,
      visitCount: list.reduce((sum, c) => sum + c.visits.length, 0),
      totalDays: list.reduce((sum, c) => sum + c.totalDays, 0),
      hotels: db.hotels.filter((h) => h.user_id === userId && cityCountry(h.city_id) === countryId).length,
      activities: db.activities.filter((a) => a.user_id === userId && cityCountry(a.city_id) === countryId).length,
      flights: db.flights.filter((f) => {
        if (f.user_id !== userId) return false;
        const arrival = db.airports.find((a) => a.id === f.arrival_airport_id);
        return arrival ? cityCountry(arrival.city_id) === countryId : false;
      }).length,
      lastVisitDate: list.map((c) => c.lastVisitDate).sort().reverse()[0],
    });
  }
  return result.sort((a, b) => b.lastVisitDate.localeCompare(a.lastVisitDate));
}
