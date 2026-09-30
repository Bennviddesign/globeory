import { DEMO_CURRENT_USER_ID as M } from '@/constants/app';
import { activity, flight, hotel, memory, place, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

/** Marcus - 2026: Copenhagen, Stockholm, Thailand, France and Milan (visit #3). */
export const marcus2026: SeedBundle = {
  trips: [
    trip('t_stockholm26', M, 'Stockholm Weekend', 'Archipelago light in February.', '2026-02-13', '2026-02-15', 'stockholm'),
    trip('t_thailand26', M, 'Thailand Adventure', 'A month of temples, street food and island hopping.', '2026-04-11', '2026-05-12', 'bangkok1'),
    trip('t_france26', M, 'France Summer', 'Paris again, then the Riviera.', '2026-06-12', '2026-06-19', 'paris2'),
    trip('t_milan26', M, 'Milan Revisited', 'A short autumn hop for design week leftovers.', '2026-09-08', '2026-09-11', 'milan3'),
  ],
  visits: [
    visit('v_copenhagen_2026', M, null, 'copenhagen', '2026-01-10', '2026-01-10', 'copenhagen', 'Day trip over the bridge.'),
    visit('v_stockholm_2026', M, 't_stockholm26', 'stockholm', '2026-02-13', '2026-02-15', 'stockholm'),
    visit('v_bangkok_2026a', M, 't_thailand26', 'bangkok', '2026-04-11', '2026-04-20', 'bangkok1', 'Temples, tuk-tuks and a perfect pad thai.'),
    visit('v_kohsamui_2026', M, 't_thailand26', 'kohsamui', '2026-04-20', '2026-05-01', 'samui'),
    visit('v_pattaya_2026', M, 't_thailand26', 'pattaya', '2026-05-01', '2026-05-05', 'pattaya'),
    // Second Bangkok visit within the same trip.
    visit('v_bangkok_2026b', M, 't_thailand26', 'bangkok', '2026-05-05', '2026-05-12', 'bangkok2', 'Back to Bangkok for the final week.'),
    // Paris, visit #2 (first was 2022) with its own image.
    visit('v_paris_2026', M, 't_france26', 'paris', '2026-06-12', '2026-06-16', 'paris2', 'Picnic by the Seine and a night at the opera.'),
    visit('v_nice_2026', M, 't_france26', 'nice', '2026-06-16', '2026-06-19', 'nice'),
    // Milan, visit #3 of 3 (spec example: 08 September 2026).
    visit('v_milan_2026', M, 't_milan26', 'milan', '2026-09-08', '2026-09-11', 'milan3', 'Third time lucky. Finally had risotto alla milanese at a proper trattoria.'),
  ],
  flights: [
    flight('f_sto26_out', M, 't_stockholm26', 'CPH', 'ARN', '2026-02-13 07:30', 'SAS', 'SK1403'),
    flight('f_sto26_ret', M, 't_stockholm26', 'ARN', 'CPH', '2026-02-15 19:15', 'SAS', 'SK1406'),
    flight('f_thai26_1', M, 't_thailand26', 'CPH', 'BKK', '2026-04-11 13:05', 'Thai Airways', 'TG951'),
    flight('f_thai26_2', M, 't_thailand26', 'BKK', 'USM', '2026-04-20 11:10', 'Bangkok Airways', 'PG121'),
    flight('f_thai26_3', M, 't_thailand26', 'USM', 'BKK', '2026-05-01 16:40', 'Bangkok Airways', 'PG138'),
    flight('f_thai26_4', M, 't_thailand26', 'BKK', 'CPH', '2026-05-12 23:15', 'Thai Airways', 'TG950'),
    flight('f_fr26_out', M, 't_france26', 'CPH', 'CDG', '2026-06-12 08:00', 'SAS', 'SK573'),
    flight('f_fr26_ret', M, 't_france26', 'NCE', 'CPH', '2026-06-19 15:25', 'SAS', 'SK2543'),
    flight('f_milan26_out', M, 't_milan26', 'CPH', 'MXP', '2026-09-08 07:05', 'SAS', 'SK631'),
    flight('f_milan26_ret', M, 't_milan26', 'MXP', 'CPH', '2026-09-11 21:00', 'SAS', 'SK632'),
  ],
  hotels: [
    hotel('h_sto26', M, 't_stockholm26', 'Södermalm Harbor Hotel', 'stockholm', '2026-02-13', '2026-02-15'),
    hotel('h_bkk26a', M, 't_thailand26', 'Riverside Heritage Hotel', 'bangkok', '2026-04-11', '2026-04-20', 'Charoen Krung Rd, Bangkok', 'bangkok1'),
    hotel('h_usm26', M, 't_thailand26', 'Chaweng Beach Resort', 'kohsamui', '2026-04-20', '2026-05-01', 'Chaweng Beach, Koh Samui', 'samui'),
    hotel('h_pty26', M, 't_thailand26', 'Pattaya Bay Hotel', 'pattaya', '2026-05-01', '2026-05-05'),
    hotel('h_bkk26b', M, 't_thailand26', 'Sukhumvit Sky Hotel', 'bangkok', '2026-05-05', '2026-05-12'),
    hotel('h_paris26', M, 't_france26', 'Hôtel Saint-Germain', 'paris', '2026-06-12', '2026-06-16', 'Rue de Seine, Paris'),
    hotel('h_nice26', M, 't_france26', 'Promenade Seaview Hotel', 'nice', '2026-06-16', '2026-06-19'),
    hotel('h_milan26', M, 't_milan26', 'Porta Venezia Hotel', 'milan', '2026-09-08', '2026-09-11'),
  ],
  activities: [
    activity('a_wat_arun26', M, 't_thailand26', 'Wat Arun at sunrise', 'bangkok', 'culture', '2026-04-14'),
    activity('a_streetfood26', M, 't_thailand26', 'Yaowarat street food tour', 'bangkok', 'food', '2026-04-16', 'Chinatown after dark.'),
    activity('a_muaythai26', M, 't_thailand26', 'Muay Thai class', 'bangkok', 'sport', '2026-05-07'),
    activity('a_angthong26', M, 't_thailand26', 'Ang Thong snorkeling trip', 'kohsamui', 'adventure', '2026-04-25'),
    activity('a_beach26', M, 't_thailand26', 'Chaweng beach day', 'kohsamui', 'beach', '2026-04-22'),
    activity('a_sanctuary26', M, 't_thailand26', 'Sanctuary of Truth', 'pattaya', 'culture', '2026-05-03'),
    activity('a_seine26', M, 't_france26', 'Seine evening cruise', 'paris', 'sightseeing', '2026-06-13'),
    activity('a_versailles26', M, 't_france26', 'Versailles day trip', 'paris', 'culture', '2026-06-14'),
    activity('a_promenade26', M, 't_france26', 'Promenade des Anglais run', 'nice', 'sport', '2026-06-17'),
    activity('a_trattoria26', M, 't_milan26', 'Risotto at a trattoria', 'milan', 'food', '2026-09-09'),
  ],
  places: [
    place('p_watpho26', M, 't_thailand26', 'Wat Pho', 'bangkok', 'landmark', '2026-04-15'),
    place('p_louvre26', M, 't_france26', 'Musée d’Orsay', 'paris', 'museum', '2026-06-13'),
    place('p_duomo26', M, 't_milan26', 'Piazza del Duomo', 'milan', 'landmark', '2026-09-08'),
  ],
  memories: [
    memory('m_samui_sunrise', M, 't_thailand26', 'Sunrise over Chaweng', 'Got up at 5 am to see the sun rise over the water. Totally worth it.', 'kohsamui', '2026-04-23'),
    memory('m_paris_picnic', M, 't_france26', 'Picnic on the Seine', 'Bread, cheese and the Eiffel Tower flickering on the hour.', 'paris', '2026-06-14'),
    memory('m_milan_third', M, 't_milan26', 'Third time in Milan', 'Some cities keep pulling you back. This one has my number.', 'milan', '2026-09-09'),
  ],
};
