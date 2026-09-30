import { flight, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const N = 'u_mina';

/** Mina Park (@mina_park): Seoul-based traveler. */
export const mina: SeedBundle = {
  trips: [
    trip('t_mina_tokyo25', N, 'Tokyo Food Crawl', 'Five days, too many meals.', '2025-11-05', '2025-11-10', 'tokyo1'),
    trip('t_mina_sydney25', N, 'Sydney Escape', 'Southern-hemisphere spring.', '2025-10-01', '2025-10-12', 'sydney'),
  ],
  visits: [
    visit('v_mina_seoul25', N, null, 'seoul', '2025-01-01', '2025-01-01', 'seoul', 'Home.', { addedDaysAgo: 300 }),
    visit('v_mina_tokyo25', N, 't_mina_tokyo25', 'tokyo', '2025-11-05', '2025-11-10', 'tokyo2', undefined, { addedDaysAgo: 120 }),
    visit('v_mina_sydney25', N, 't_mina_sydney25', 'sydney', '2025-10-01', '2025-10-12', 'sydney'),
    visit('v_mina_bangkok24', N, null, 'bangkok', '2024-02-10', '2024-02-16', 'bangkok2'),
    visit('v_mina_paris24', N, null, 'paris', '2024-08-20', '2024-08-26', 'paris2'),
    visit('v_mina_busan24', N, null, 'busan', '2024-05-01', '2024-05-03', 'busan'),
  ],
  flights: [
    flight('f_mina_1', N, 't_mina_tokyo25', 'ICN', 'HND', '2025-11-05 08:40', 'Korean Air', 'KE2705'),
    flight('f_mina_2', N, 't_mina_sydney25', 'ICN', 'SYD', '2025-10-01 19:20', 'Korean Air', 'KE121'),
  ],
  hotels: [],
  activities: [],
  places: [],
  memories: [],
};
