import { trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const L = 'u_lukas';

/**
 * Lukas Berg (@lukas_berg): PRIVATE profile. He has a public Tokyo visit, but
 * because the profile is private it is excluded from destination discovery
 * and his content is only visible to followers.
 */
export const lukas: SeedBundle = {
  trips: [trip('t_lukas_tokyo25', L, 'Tokyo Notes', 'Private diary.', '2025-03-01', '2025-03-08', 'tokyo1')],
  visits: [
    visit('v_lukas_tokyo25', L, 't_lukas_tokyo25', 'tokyo', '2025-03-01', '2025-03-08', 'tokyo1', undefined, { addedDaysAgo: 20 }),
    visit('v_lukas_berlin24', L, null, 'berlin', '2024-06-01', '2024-06-01', 'berlin'),
    visit('v_lukas_munich24', L, null, 'munich', '2024-10-03', '2024-10-06', 'munich'),
  ],
  flights: [],
  hotels: [],
  activities: [],
  places: [],
  memories: [],
};
