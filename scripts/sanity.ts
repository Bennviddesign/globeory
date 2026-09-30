/**
 * Sanity check of the data layer (no React Native needed):
 *   npx tsx scripts/sanity.ts
 */
import { DEMO_CURRENT_USER_ID } from '@/constants/app';
import { buildDemoDatabase } from '@/services/demo';
import { enforceInvariants } from '@/services/data/integrityService';
import { getCity, getAirport } from '@/services/data/lookup';
import { haversineKm } from '@/services/geo/distance';
import { searchDestinations } from '@/services/search/destinationSearch';
import { scopeToUser } from '@/services/social/visibilityService';
import { computeStats } from '@/services/stats/statsService';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
}

const db = enforceInvariants(buildDemoDatabase());
const me = DEMO_CURRENT_USER_ID;

const milan = db.cities.find((c) => c.name === 'Milan');
const milanVisits = db.destination_visits.filter((v) => v.user_id === me && v.city_id === milan?.id);
check('Milan has 3 separate visits', milanVisits.length === 3, String(milanVisits.length));
check('Every visit has at most one image (string | null)', db.destination_visits.every((v) => v.image_path === null || typeof v.image_path === 'string'));

const badDistance = db.flights.filter((f) => {
  const a = getAirport(db, f.departure_airport_id);
  const b = getAirport(db, f.arrival_airport_id);
  if (!a || !b) return true;
  return Math.abs(haversineKm(a.latitude, a.longitude, b.latitude, b.longitude) - f.distance_km) > 1;
});
check('Flight distances match Haversine', badDistance.length === 0, `${db.flights.length} flights`);

const stats = computeStats(scopeToUser(db, me, me), me);
console.log('Marcus stats:', { countries: stats.countries, cities: stats.cities, flights: stats.flights, km: Math.round(stats.totalDistanceKm) });
check('Marcus has data', stats.countries >= 10 && stats.flights >= 20);

const tokyo = searchDestinations(db, me, 'Tokyo', 'relevance', 0, 50).results.map((r) => r.user.username);
console.log('Tokyo results for Marcus:', tokyo);
const names = new Map(db.users.map((u) => [u.id, u.username]));
check('Tokyo search excludes private profile and followers-only non-followed', !tokyo.includes('lukas') && !tokyo.some((n) => n.includes('elin')));
void names;
void getCity;

console.log(failures === 0 ? '\nAll checks passed' : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
