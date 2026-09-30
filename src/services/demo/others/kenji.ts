import { flight, memory, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const K = 'u_kenji';

/** Kenji Sato (@kenji_sato): Tokyo local with a few trips abroad. */
export const kenji: SeedBundle = {
  trips: [
    trip('t_kenji_sea25', K, 'Southeast Asia Loop', 'Singapore and Bangkok in two weeks.', '2025-02-01', '2025-02-14', 'singapore'),
    trip('t_kenji_au24', K, 'Sydney Summer', 'Beaches and coastal walks.', '2024-12-20', '2025-01-03', 'sydney'),
  ],
  visits: [
    visit('v_kenji_tokyo25', K, null, 'tokyo', '2025-06-01', '2025-06-01', 'tokyo1', 'Home base.', { addedDaysAgo: 40 }),
    visit('v_kenji_tokyo26', K, null, 'tokyo', '2026-09-01', '2026-09-03', 'tokyo2', 'Staycation in Asakusa and Yanaka.', { addedDaysAgo: 9 }),
    visit('v_kenji_singapore25', K, 't_kenji_sea25', 'singapore', '2025-02-01', '2025-02-07', 'singapore'),
    visit('v_kenji_bangkok25', K, 't_kenji_sea25', 'bangkok', '2025-02-07', '2025-02-14', 'bangkok1'),
    visit('v_kenji_sydney24', K, 't_kenji_au24', 'sydney', '2024-12-20', '2025-01-03', 'sydney'),
    visit('v_kenji_seoul23', K, null, 'seoul', '2023-11-03', '2023-11-06', 'seoul'),
    visit('v_kenji_osaka23', K, null, 'osaka', '2023-04-14', '2023-04-16', 'osaka'),
  ],
  flights: [
    flight('f_kenji_1', K, 't_kenji_sea25', 'HND', 'SIN', '2025-02-01 10:00', 'Singapore Airlines', 'SQ633'),
    flight('f_kenji_2', K, 't_kenji_sea25', 'BKK', 'HND', '2025-02-14 23:30', 'Japan Airlines', 'JL034'),
    flight('f_kenji_3', K, 't_kenji_au24', 'HND', 'SYD', '2024-12-20 21:30', 'Qantas', 'QF22'),
  ],
  hotels: [],
  activities: [],
  places: [],
  memories: [
    memory('m_kenji_izakaya', K, null, 'Izakaya in Yanaka', 'A tiny place with six stools and the best yakitori in the city.', 'tokyo', '2026-09-02', { addedDaysAgo: 1 }),
  ],
};
