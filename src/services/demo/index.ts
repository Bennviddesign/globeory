import { emptyDatabase } from '../storage/databaseStorage';
import type { Database } from '@/models/database';
import { DEMO_NOTIFICATIONS, DEMO_FOLLOWS } from './demoSocial';
import { DEMO_USERS } from './demoUsers';
import { marcus2022 } from './marcus/marcus2022';
import { marcus2023 } from './marcus/marcus2023';
import { marcus2024 } from './marcus/marcus2024';
import { marcus2025 } from './marcus/marcus2025';
import { marcus2026 } from './marcus/marcus2026';
import { anna } from './others/anna';
import { elin } from './others/elin';
import { kenji } from './others/kenji';
import { lukas } from './others/lukas';
import { mina } from './others/mina';
import { sofia } from './others/sofia';
import { mergeBundles } from './seedBundle';

export { DEMO_CURRENT_USER_ID } from '@/constants/app';

/**
 * Builds the complete Demo Mode database: six countries' worth of trips,
 * dozens of flights, hotels, activities, repeated visits (Milan x3, Paris x2,
 * Tokyo x2, Bangkok x2, Athens x2), example profiles, follows and
 * notifications. Works fully offline, no backend needed.
 */
export function buildDemoDatabase(): Database {
  const data = mergeBundles(
    marcus2022,
    marcus2023,
    marcus2024,
    marcus2025,
    marcus2026,
    anna,
    kenji,
    sofia,
    mina,
    elin,
    lukas,
  );

  return {
    ...emptyDatabase(),
    users: DEMO_USERS.map((u) => ({ ...u })),
    trips: data.trips,
    destination_visits: data.visits,
    flights: data.flights,
    hotels: data.hotels,
    activities: data.activities,
    places: data.places,
    memories: data.memories,
    follows: DEMO_FOLLOWS,
    notifications: DEMO_NOTIFICATIONS,
  };
}
