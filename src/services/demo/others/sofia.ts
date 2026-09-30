import { activity, flight, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const S = 'u_sofia';

/** Sofia Rossi (@sofia_rossi): based in Milan. One Tokyo visit is private and never discoverable. */
export const sofia: SeedBundle = {
  trips: [
    trip('t_sofia_paris25', S, 'Paris Fashion Week', 'Work and wandering.', '2025-09-28', '2025-10-02', 'paris3'),
    trip('t_sofia_iberia24', S, 'Iberian Escape', 'Barcelona and Lisbon.', '2024-05-10', '2024-05-20', 'barcelona'),
  ],
  visits: [
    visit('v_sofia_milan25a', S, null, 'milan', '2025-01-10', '2025-01-10', 'milan1', 'Home.', { addedDaysAgo: 200 }),
    visit('v_sofia_milan25b', S, null, 'milan', '2025-11-22', '2025-11-22', 'milan2', 'Winter light on the Duomo.', { addedDaysAgo: 120 }),
    visit('v_sofia_paris25', S, 't_sofia_paris25', 'paris', '2025-09-28', '2025-10-02', 'paris1'),
    visit('v_sofia_barcelona24', S, 't_sofia_iberia24', 'barcelona', '2024-05-10', '2024-05-15', 'barcelona'),
    visit('v_sofia_lisbon24', S, 't_sofia_iberia24', 'lisbon', '2024-05-15', '2024-05-20', 'lisbon'),
    // Private: excluded from destination search.
    visit('v_sofia_tokyo25', S, null, 'tokyo', '2025-04-02', '2025-04-09', 'tokyo1', 'Private trip.', { vis: 'private', addedDaysAgo: 60 }),
  ],
  flights: [
    flight('f_sofia_1', S, 't_sofia_paris25', 'MXP', 'CDG', '2025-09-28 08:20', 'Air France', 'AF1913'),
    flight('f_sofia_2', S, 't_sofia_iberia24', 'MXP', 'BCN', '2024-05-10 09:00', 'Vueling', 'VY6231'),
  ],
  hotels: [],
  activities: [
    activity('a_sofia_brera', S, null, 'Brera gallery morning', 'milan', 'culture', '2026-09-24', 'Quiet Sunday with espresso.', { addedDaysAgo: 5 }),
  ],
  places: [],
  memories: [],
};
