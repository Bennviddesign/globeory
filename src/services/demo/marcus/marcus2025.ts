import { DEMO_CURRENT_USER_ID as M } from '@/constants/app';
import { activity, flight, hotel, memory, place, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

/** Marcus - 2025: Istanbul, Italy (Milan visit #2), Spain, Munich and a standalone Malmö visit. */
export const marcus2025: SeedBundle = {
  trips: [
    trip('t_istanbul25', M, 'Istanbul City Break', 'Bazaars, ferries and strong tea.', '2025-01-17', '2025-01-20', 'istanbul'),
    trip('t_italy25', M, 'Italy Spring', 'Milan, Florence and Rome in ten days.', '2025-03-20', '2025-03-30', 'florence'),
    trip('t_spain25', M, 'Spain Autumn', 'Gaudí in Barcelona, then tapas in Madrid.', '2025-10-03', '2025-10-10', 'barcelona'),
    trip('t_munich25', M, 'Munich Christmas Markets', 'Mulled wine and snow.', '2025-12-05', '2025-12-08', 'munich'),
  ],
  visits: [
    visit('v_istanbul_2025', M, 't_istanbul25', 'istanbul', '2025-01-17', '2025-01-20', 'istanbul'),
    // Milan, visit #2 of 3 - different trip, dates and image than 2023.
    visit('v_milan_2025', M, 't_italy25', 'milan', '2025-03-20', '2025-03-23', 'milan2', 'Saw The Last Supper this time. Booked weeks in advance.'),
    visit('v_florence_2025', M, 't_italy25', 'florence', '2025-03-23', '2025-03-26', 'florence'),
    visit('v_rome_2025', M, 't_italy25', 'rome', '2025-03-26', '2025-03-30', 'rome'),
    visit('v_barcelona_2025', M, 't_spain25', 'barcelona', '2025-10-03', '2025-10-07', 'barcelona'),
    visit('v_madrid_2025', M, 't_spain25', 'madrid', '2025-10-07', '2025-10-10', 'madrid'),
    visit('v_munich_2025', M, 't_munich25', 'munich', '2025-12-05', '2025-12-08', 'munich'),
    // A visit that does not belong to any trip.
    visit('v_malmo_2025', M, null, 'malmo', '2025-06-20', '2025-06-22', 'malmo', 'Midsummer at home.'),
  ],
  flights: [
    flight('f_ist25_out', M, 't_istanbul25', 'CPH', 'IST', '2025-01-17 06:45', 'Turkish Airlines', 'TK1792'),
    flight('f_ist25_ret', M, 't_istanbul25', 'IST', 'CPH', '2025-01-20 15:10', 'Turkish Airlines', 'TK1793'),
    flight('f_italy25_out', M, 't_italy25', 'CPH', 'MXP', '2025-03-20 07:20', 'SAS', 'SK631'),
    flight('f_italy25_ret', M, 't_italy25', 'FCO', 'CPH', '2025-03-30 18:30', 'SAS', 'SK598'),
    flight('f_spain25_out', M, 't_spain25', 'CPH', 'BCN', '2025-10-03 08:10', 'Vueling', 'VY1196'),
    flight('f_spain25_ret', M, 't_spain25', 'MAD', 'CPH', '2025-10-10 14:35', 'Iberia', 'IB3182'),
    flight('f_munich25_out', M, 't_munich25', 'CPH', 'MUC', '2025-12-05 09:25', 'Lufthansa', 'LH2453'),
    flight('f_munich25_ret', M, 't_munich25', 'MUC', 'CPH', '2025-12-08 17:55', 'Lufthansa', 'LH2454'),
  ],
  hotels: [
    hotel('h_ist25', M, 't_istanbul25', 'Galata Tower Suites', 'istanbul', '2025-01-17', '2025-01-20'),
    hotel('h_milan25', M, 't_italy25', 'Brera Boutique Hotel', 'milan', '2025-03-20', '2025-03-23'),
    hotel('h_florence25', M, 't_italy25', 'Oltrarno Guesthouse', 'florence', '2025-03-23', '2025-03-26'),
    hotel('h_rome25', M, 't_italy25', 'Trastevere Hotel', 'rome', '2025-03-26', '2025-03-30'),
    hotel('h_barcelona25', M, 't_spain25', 'Gràcia Design Hotel', 'barcelona', '2025-10-03', '2025-10-07'),
    hotel('h_madrid25', M, 't_spain25', 'Gran Vía Rooms', 'madrid', '2025-10-07', '2025-10-10'),
  ],
  activities: [
    activity('a_lastsupper25', M, 't_italy25', 'The Last Supper', 'milan', 'culture', '2025-03-21'),
    activity('a_uffizi25', M, 't_italy25', 'Uffizi Gallery', 'florence', 'culture', '2025-03-24'),
    activity('a_colosseum25', M, 't_italy25', 'Colosseum & Forum', 'rome', 'sightseeing', '2025-03-27'),
    activity('a_pasta25', M, 't_italy25', 'Pasta making class', 'rome', 'food', '2025-03-28'),
    activity('a_sagrada25', M, 't_spain25', 'Sagrada Família', 'barcelona', 'culture', '2025-10-04'),
    activity('a_guell25', M, 't_spain25', 'Park Güell', 'barcelona', 'nature', '2025-10-05'),
    activity('a_prado25', M, 't_spain25', 'Museo del Prado', 'madrid', 'culture', '2025-10-08'),
    activity('a_xmas25', M, 't_munich25', 'Marienplatz Christmas market', 'munich', 'shopping', '2025-12-06'),
  ],
  places: [
    place('p_trevi25', M, 't_italy25', 'Trevi Fountain', 'rome', 'landmark', '2025-03-27'),
    place('p_bunkers25', M, 't_spain25', 'Bunkers del Carmel', 'barcelona', 'viewpoint', '2025-10-06'),
  ],
  memories: [
    memory('m_milan_return', M, 't_italy25', 'Milan feels familiar now', 'Walked the same streets as in 2023 and found them changed and the same at once.', 'milan', '2025-03-22'),
  ],
};
