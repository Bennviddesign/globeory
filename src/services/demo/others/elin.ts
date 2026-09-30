import { trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const E = 'u_elin';

/**
 * Elin Nyström (@elin_ny): public profile, but her Tokyo visit is
 * followers-only. Marcus does NOT follow her in the demo, so she does not
 * appear in his Tokyo search (spec section 32).
 */
export const elin: SeedBundle = {
  trips: [trip('t_elin_tokyo26', E, 'Tokyo with Friends', 'Shared with followers only.', '2026-09-20', '2026-09-27', 'tokyo2', { vis: 'followers', addedDaysAgo: 4 })],
  visits: [
    visit('v_elin_tokyo26', E, 't_elin_tokyo26', 'tokyo', '2026-09-20', '2026-09-27', 'tokyo2', undefined, { vis: 'followers', addedDaysAgo: 4 }),
    visit('v_elin_rome25', E, null, 'rome', '2025-06-10', '2025-06-14', 'rome'),
    visit('v_elin_gothenburg25', E, null, 'gothenburg', '2025-08-01', '2025-08-01', undefined, 'Home.'),
  ],
  flights: [],
  hotels: [],
  activities: [],
  places: [],
  memories: [],
};
