import { DEMO_CURRENT_USER_ID as M } from '@/constants/app';
import { activity, flight, hotel, memory, place, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

/** Marcus - 2024: Dubai/Singapore, South Korea, Berlin and Japan. */
export const marcus2024: SeedBundle = {
  trips: [
    trip('t_dubai24', M, 'Dubai & Singapore', 'Winter escape: desert heat, then the Garden City.', '2024-01-05', '2024-01-14', 'dubai'),
    trip('t_korea24', M, 'Seoul & Busan', 'Cherry blossoms, night markets and the coast.', '2024-04-12', '2024-04-22', 'seoul'),
    trip('t_berlin24', M, 'Berlin Autumn', 'Museums, clubs and currywurst.', '2024-09-20', '2024-09-23', 'berlin'),
    trip('t_japan24', M, 'Japan Autumn', 'Tokyo, Kyoto and Osaka in peak foliage season.', '2024-10-05', '2024-10-20', 'tokyo1'),
  ],
  visits: [
    visit('v_dubai_2024', M, 't_dubai24', 'dubai', '2024-01-05', '2024-01-09', 'dubai'),
    visit('v_singapore_2024', M, 't_dubai24', 'singapore', '2024-01-09', '2024-01-14', 'singapore'),
    visit('v_seoul_2024', M, 't_korea24', 'seoul', '2024-04-12', '2024-04-18', 'seoul'),
    visit('v_busan_2024', M, 't_korea24', 'busan', '2024-04-18', '2024-04-22', 'busan'),
    visit('v_berlin_2024', M, 't_berlin24', 'berlin', '2024-09-20', '2024-09-23', 'berlin'),
    visit('v_tokyo_2024a', M, 't_japan24', 'tokyo', '2024-10-05', '2024-10-11', 'tokyo1', 'Jet lag and neon. First ramen in Shinjuku at 2 am.', { addedDaysAgo: 15 }),
    visit('v_kyoto_2024', M, 't_japan24', 'kyoto', '2024-10-11', '2024-10-15', 'kyoto'),
    visit('v_osaka_2024', M, 't_japan24', 'osaka', '2024-10-15', '2024-10-18', 'osaka'),
    // Second Tokyo visit in the same trip, different dates and a different image.
    visit('v_tokyo_2024b', M, 't_japan24', 'tokyo', '2024-10-18', '2024-10-20', 'tokyo2', 'Back in Tokyo for the last two days: Shibuya at night.', { addedDaysAgo: 14 }),
  ],
  flights: [
    flight('f_dubai24_1', M, 't_dubai24', 'CPH', 'DXB', '2024-01-05 14:00', 'Emirates', 'EK152'),
    flight('f_dubai24_2', M, 't_dubai24', 'DXB', 'SIN', '2024-01-09 09:30', 'Emirates', 'EK354'),
    flight('f_dubai24_3', M, 't_dubai24', 'SIN', 'CPH', '2024-01-14 23:55', 'Singapore Airlines', 'SQ351'),
    flight('f_korea24_1', M, 't_korea24', 'CPH', 'ICN', '2024-04-12 12:30', 'Korean Air', 'KE928'),
    flight('f_korea24_2', M, 't_korea24', 'ICN', 'PUS', '2024-04-18 10:15', 'Korean Air', 'KE1103'),
    flight('f_korea24_3', M, 't_korea24', 'PUS', 'ICN', '2024-04-22 08:40', 'Korean Air', 'KE1104'),
    flight('f_korea24_4', M, 't_korea24', 'ICN', 'CPH', '2024-04-22 13:20', 'Korean Air', 'KE927'),
    flight('f_berlin24_out', M, 't_berlin24', 'CPH', 'BER', '2024-09-20 10:00', 'Lufthansa', 'LH2427'),
    flight('f_berlin24_ret', M, 't_berlin24', 'BER', 'CPH', '2024-09-23 16:45', 'Lufthansa', 'LH2428'),
    flight('f_japan24_out', M, 't_japan24', 'CPH', 'HND', '2024-10-05 11:45', 'Japan Airlines', 'JL042'),
    flight('f_japan24_dom', M, 't_japan24', 'KIX', 'HND', '2024-10-18 09:00', 'Japan Airlines', 'JL226'),
    flight('f_japan24_ret', M, 't_japan24', 'HND', 'CPH', '2024-10-20 12:10', 'Japan Airlines', 'JL041'),
  ],
  hotels: [
    hotel('h_dubai24', M, 't_dubai24', 'Marina Skyline Hotel', 'dubai', '2024-01-05', '2024-01-09'),
    hotel('h_singapore24', M, 't_dubai24', 'Bayfront Garden Hotel', 'singapore', '2024-01-09', '2024-01-14'),
    hotel('h_seoul24', M, 't_korea24', 'Hongdae Stay', 'seoul', '2024-04-12', '2024-04-18'),
    hotel('h_busan24', M, 't_korea24', 'Haeundae Beach Hotel', 'busan', '2024-04-18', '2024-04-22'),
    hotel('h_berlin24', M, 't_berlin24', 'Kreuzberg Loft', 'berlin', '2024-09-20', '2024-09-23'),
    hotel('h_tokyo24a', M, 't_japan24', 'Shinjuku Capsule Plus', 'tokyo', '2024-10-05', '2024-10-11', 'Shinjuku, Tokyo', 'tokyo1'),
    hotel('h_kyoto24', M, 't_japan24', 'Gion Ryokan', 'kyoto', '2024-10-11', '2024-10-15', 'Gion, Kyoto'),
    hotel('h_osaka24', M, 't_japan24', 'Namba Hotel', 'osaka', '2024-10-15', '2024-10-18'),
  ],
  activities: [
    activity('a_burj24', M, 't_dubai24', 'Burj Khalifa observation deck', 'dubai', 'sightseeing', '2024-01-06'),
    activity('a_desert24', M, 't_dubai24', 'Desert safari', 'dubai', 'adventure', '2024-01-07'),
    activity('a_gardens24', M, 't_dubai24', 'Gardens by the Bay', 'singapore', 'nature', '2024-01-11'),
    activity('a_hawker24', M, 't_dubai24', 'Hawker centre dinner', 'singapore', 'food', '2024-01-12'),
    activity('a_palace24', M, 't_korea24', 'Gyeongbokgung Palace', 'seoul', 'culture', '2024-04-14'),
    activity('a_jagalchi24', M, 't_korea24', 'Jagalchi fish market', 'busan', 'food', '2024-04-19'),
    activity('a_sensoji24', M, 't_japan24', 'Senso-ji Temple', 'tokyo', 'culture', '2024-10-07'),
    activity('a_teamlab24', M, 't_japan24', 'teamLab Planets', 'tokyo', 'culture', '2024-10-09'),
    activity('a_fushimi24', M, 't_japan24', 'Fushimi Inari hike', 'kyoto', 'nature', '2024-10-12'),
    activity('a_dotonbori24', M, 't_japan24', 'Dotonbori food tour', 'osaka', 'food', '2024-10-16'),
  ],
  places: [
    place('p_brandenburg24', M, 't_berlin24', 'Brandenburg Gate', 'berlin', 'landmark', '2024-09-21'),
    place('p_shibuya24', M, 't_japan24', 'Shibuya Crossing', 'tokyo', 'landmark', '2024-10-19'),
  ],
  memories: [
    memory('m_ramen24', M, 't_japan24', 'First ramen in Shinjuku', 'Tiny counter, eight seats, no English menu. Pointed at the picture and it was perfect.', 'tokyo', '2024-10-06'),
    memory('m_blossom24', M, 't_korea24', 'Blossoms along the river', 'Petals everywhere on the Han River path.', 'seoul', '2024-04-15'),
  ],
};
