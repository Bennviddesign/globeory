import { DEMO_CURRENT_USER_ID as M } from '@/constants/app';
import { activity, flight, hotel, memory, place, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

/** Marcus - 2023: Amsterdam, Milan (first visit), Greek islands and Portugal. */
export const marcus2023: SeedBundle = {
  trips: [
    trip('t_ams23', M, 'Amsterdam Canals', 'Cold, bright and full of bikes.', '2023-02-10', '2023-02-12', 'amsterdam'),
    trip('t_milan23', M, 'Lombardy Long Weekend', 'Design, aperitivo and the Duomo roof.', '2023-05-14', '2023-05-17', 'milan1'),
    trip('t_greece23', M, 'Greek Islands', 'Athens, Santorini and back through Athens again.', '2023-07-01', '2023-07-12', 'santorini'),
    trip('t_portugal23', M, 'Portugal Road Trip', 'Lisbon to Porto with custard tarts all the way.', '2023-09-15', '2023-09-24', 'porto'),
  ],
  visits: [
    visit('v_amsterdam_2023', M, 't_ams23', 'amsterdam', '2023-02-10', '2023-02-12', 'amsterdam'),
    // Milan, visit #1 of 3 (spec example: 14 May 2023).
    visit('v_milan_2023', M, 't_milan23', 'milan', '2023-05-14', '2023-05-17', 'milan1', 'First time in Milan. Climbed the Duomo roof at golden hour.'),
    visit('v_athens_2023a', M, 't_greece23', 'athens', '2023-07-01', '2023-07-04', 'athens', 'Arrival days in Athens.'),
    visit('v_santorini_2023', M, 't_greece23', 'santorini', '2023-07-04', '2023-07-10', 'santorini'),
    // Same city again within the same trip at a different date: separate visit, no image.
    visit('v_athens_2023b', M, 't_greece23', 'athens', '2023-07-10', '2023-07-12', undefined, 'Two more days in Athens before flying home.'),
    visit('v_lisbon_2023', M, 't_portugal23', 'lisbon', '2023-09-15', '2023-09-19', 'lisbon'),
    visit('v_porto_2023', M, 't_portugal23', 'porto', '2023-09-19', '2023-09-23', 'porto'),
  ],
  flights: [
    flight('f_ams23_out', M, 't_ams23', 'CPH', 'AMS', '2023-02-10 08:15', 'KLM', 'KL1176'),
    flight('f_ams23_ret', M, 't_ams23', 'AMS', 'CPH', '2023-02-12 18:45', 'KLM', 'KL1177'),
    flight('f_milan23_out', M, 't_milan23', 'CPH', 'MXP', '2023-05-14 06:55', 'SAS', 'SK631'),
    flight('f_milan23_ret', M, 't_milan23', 'MXP', 'CPH', '2023-05-17 20:10', 'SAS', 'SK632'),
    flight('f_greece23_1', M, 't_greece23', 'CPH', 'ATH', '2023-07-01 06:30', 'Aegean', 'A3963'),
    flight('f_greece23_2', M, 't_greece23', 'ATH', 'JTR', '2023-07-04 12:00', 'Aegean', 'A3092'),
    flight('f_greece23_3', M, 't_greece23', 'JTR', 'ATH', '2023-07-10 15:30', 'Aegean', 'A3093'),
    flight('f_greece23_4', M, 't_greece23', 'ATH', 'CPH', '2023-07-12 13:20', 'Aegean', 'A3964'),
    flight('f_pt23_out', M, 't_portugal23', 'CPH', 'LIS', '2023-09-15 07:40', 'TAP Air Portugal', 'TP765'),
    flight('f_pt23_ret', M, 't_portugal23', 'OPO', 'CPH', '2023-09-24 14:05', 'TAP Air Portugal', 'TP768'),
  ],
  hotels: [
    hotel('h_ams23', M, 't_ams23', 'Canal House Hotel', 'amsterdam', '2023-02-10', '2023-02-12'),
    hotel('h_milan23', M, 't_milan23', 'Navigli Design Hotel', 'milan', '2023-05-14', '2023-05-17', 'Via Vigevano, Milan'),
    hotel('h_athens23', M, 't_greece23', 'Plaka Boutique Hotel', 'athens', '2023-07-01', '2023-07-04'),
    hotel('h_santorini23', M, 't_greece23', 'Caldera View Suites', 'santorini', '2023-07-04', '2023-07-10', 'Oia, Santorini', 'santorini'),
    hotel('h_lisbon23', M, 't_portugal23', 'Alfama Terrace Hotel', 'lisbon', '2023-09-15', '2023-09-19'),
    hotel('h_porto23', M, 't_portugal23', 'Ribeira River Hotel', 'porto', '2023-09-19', '2023-09-23'),
  ],
  activities: [
    activity('a_duomo23', M, 't_milan23', 'Duomo di Milano rooftop', 'milan', 'sightseeing', '2023-05-15'),
    activity('a_navigli23', M, 't_milan23', 'Aperitivo in Navigli', 'milan', 'food', '2023-05-16', 'Spritz and too many snacks.'),
    activity('a_acropolis23', M, 't_greece23', 'Acropolis & Parthenon', 'athens', 'culture', '2023-07-02'),
    activity('a_oia23', M, 't_greece23', 'Sunset in Oia', 'santorini', 'sightseeing', '2023-07-06'),
    activity('a_boat23', M, 't_greece23', 'Caldera boat trip', 'santorini', 'adventure', '2023-07-08'),
    activity('a_tram28_23', M, 't_portugal23', 'Tram 28 ride', 'lisbon', 'sightseeing', '2023-09-16'),
    activity('a_port23', M, 't_portugal23', 'Port wine tasting', 'porto', 'food', '2023-09-21'),
  ],
  places: [
    place('p_belem23', M, 't_portugal23', 'Belém Tower', 'lisbon', 'landmark', '2023-09-17'),
    place('p_livraria23', M, 't_portugal23', 'Livraria Lello', 'porto', 'landmark', '2023-09-20'),
  ],
  memories: [
    memory('m_oia_sunset', M, 't_greece23', 'Applause at sunset', 'Everyone in Oia clapped when the sun went down. Felt a bit silly, then clapped too.', 'santorini', '2023-07-06'),
  ],
};
