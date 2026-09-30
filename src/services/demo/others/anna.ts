import { activity, flight, hotel, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

const A = 'u_anna';

/** Anna Johansson (@anna_travels): public profile, recently added Tokyo. */
export const anna: SeedBundle = {
  trips: [
    trip('t_anna_tokyo26', A, 'Tokyo Spring', 'Hanami, tiny bars and day trips out of Tokyo.', '2026-03-28', '2026-04-09', 'tokyo2', { addedDaysAgo: 3 }),
    trip('t_anna_italy25', A, 'Italian Rail Journey', 'Rome to Venice by train.', '2025-05-02', '2025-05-12', 'venice'),
    trip('t_anna_seoul25', A, 'Seoul Long Weekend', 'Cafés, palaces and skincare shopping.', '2025-09-19', '2025-09-22', 'seoul'),
  ],
  visits: [
    visit('v_anna_tokyo26', A, 't_anna_tokyo26', 'tokyo', '2026-03-28', '2026-04-04', 'tokyo2', 'Cherry blossoms in Ueno.', { addedDaysAgo: 3 }),
    visit('v_anna_kyoto26', A, 't_anna_tokyo26', 'kyoto', '2026-04-04', '2026-04-07', 'kyoto', undefined, { addedDaysAgo: 3 }),
    visit('v_anna_osaka26', A, 't_anna_tokyo26', 'osaka', '2026-04-07', '2026-04-09', 'osaka', undefined, { addedDaysAgo: 3 }),
    visit('v_anna_rome25', A, 't_anna_italy25', 'rome', '2025-05-02', '2025-05-06', 'rome'),
    visit('v_anna_florence25', A, 't_anna_italy25', 'florence', '2025-05-06', '2025-05-09', 'florence'),
    visit('v_anna_venice25', A, 't_anna_italy25', 'venice', '2025-05-09', '2025-05-12', 'venice'),
    visit('v_anna_seoul25', A, 't_anna_seoul25', 'seoul', '2025-09-19', '2025-09-22', 'seoul'),
    visit('v_anna_paris24', A, null, 'paris', '2024-06-01', '2024-06-04', 'paris3'),
    visit('v_anna_barcelona23', A, null, 'barcelona', '2023-09-10', '2023-09-14', 'barcelona'),
    visit('v_anna_bangkok23', A, null, 'bangkok', '2023-01-05', '2023-01-15', 'bangkok2'),
    visit('v_anna_lisbon22', A, null, 'lisbon', '2022-10-01', '2022-10-05', 'lisbon'),
    visit('v_anna_newyork22', A, null, 'newyork', '2022-05-01', '2022-05-07', undefined),
  ],
  flights: [
    flight('f_anna_1', A, 't_anna_tokyo26', 'ARN', 'HND', '2026-03-28 10:50', 'Finnair', 'AY1600'),
    flight('f_anna_2', A, 't_anna_tokyo26', 'KIX', 'ARN', '2026-04-09 11:15', 'Finnair', 'AY1601'),
    flight('f_anna_3', A, 't_anna_seoul25', 'ARN', 'ICN', '2025-09-19 12:40', 'Finnair', 'AY41'),
  ],
  hotels: [
    hotel('h_anna_tokyo', A, 't_anna_tokyo26', 'Asakusa Garden Inn', 'tokyo', '2026-03-28', '2026-04-04'),
  ],
  activities: [
    activity('a_anna_hanami', A, 't_anna_tokyo26', 'Hanami in Ueno Park', 'tokyo', 'nature', '2026-03-30', undefined, { addedDaysAgo: 3 }),
  ],
  places: [],
  memories: [],
};
