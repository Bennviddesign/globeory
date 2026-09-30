import { DEMO_CURRENT_USER_ID as M } from '@/constants/app';
import { activity, flight, hotel, memory, trip, visit } from '../seedBuilders';
import type { SeedBundle } from '../seedBundle';

/** Marcus - 2022: Paris, London and New York. */
export const marcus2022: SeedBundle = {
  trips: [
    trip('t_paris22', M, 'Paris in Autumn', 'First proper trip to Paris: museums, bakeries and long walks along the Seine.', '2022-10-14', '2022-10-19', 'paris1'),
    trip('t_london22', M, 'London Weekend', 'A quick weekend in London.', '2022-11-25', '2022-11-27', 'london'),
    trip('t_nyc22', M, 'New York Christmas', 'Christmas lights, ice skating and way too much pizza.', '2022-12-21', '2022-12-28', 'newyork'),
  ],
  visits: [
    visit('v_paris_2022', M, 't_paris22', 'paris', '2022-10-14', '2022-10-19', 'paris1', 'Stayed in Le Marais. Found the best croissant near Rue de Bretagne.'),
    visit('v_london_2022', M, 't_london22', 'london', '2022-11-25', '2022-11-27', 'london'),
    visit('v_newyork_2022', M, 't_nyc22', 'newyork', '2022-12-21', '2022-12-28', 'newyork', 'Snow on Christmas Eve in Central Park.'),
  ],
  flights: [
    flight('f_paris22_out', M, 't_paris22', 'CPH', 'CDG', '2022-10-14 07:10', 'SAS', 'SK571'),
    flight('f_paris22_ret', M, 't_paris22', 'CDG', 'CPH', '2022-10-19 17:30', 'SAS', 'SK572'),
    flight('f_london22_out', M, 't_london22', 'CPH', 'LHR', '2022-11-25 09:05', 'British Airways', 'BA811'),
    flight('f_london22_ret', M, 't_london22', 'LHR', 'CPH', '2022-11-27 19:40', 'British Airways', 'BA812'),
    flight('f_nyc22_out', M, 't_nyc22', 'CPH', 'JFK', '2022-12-21 11:20', 'SAS', 'SK903'),
    flight('f_nyc22_ret', M, 't_nyc22', 'JFK', 'CPH', '2022-12-28 18:10', 'SAS', 'SK904'),
  ],
  hotels: [
    hotel('h_paris22', M, 't_paris22', 'Hôtel Le Marais', 'paris', '2022-10-14', '2022-10-19', '12 Rue de Bretagne, 75003 Paris'),
    hotel('h_london22', M, 't_london22', 'Holborn Townhouse', 'london', '2022-11-25', '2022-11-27'),
    hotel('h_nyc22', M, 't_nyc22', 'Midtown Loft Hotel', 'newyork', '2022-12-21', '2022-12-28', '350 W 39th St, New York'),
  ],
  activities: [
    activity('a_louvre22', M, 't_paris22', 'Louvre Museum', 'paris', 'culture', '2022-10-15', 'Mona Lisa, then everything else.'),
    activity('a_eiffel22', M, 't_paris22', 'Eiffel Tower summit', 'paris', 'sightseeing', '2022-10-16'),
    activity('a_montmartre22', M, 't_paris22', 'Montmartre walk', 'paris', 'sightseeing', '2022-10-17'),
    activity('a_centralpark22', M, 't_nyc22', 'Central Park in the snow', 'newyork', 'nature', '2022-12-24'),
    activity('a_broadway22', M, 't_nyc22', 'Broadway show', 'newyork', 'culture', '2022-12-26'),
  ],
  places: [],
  memories: [
    memory('m_sunset_sacrecoeur', M, 't_paris22', 'Sunset at Sacré-Cœur', 'The whole hill was singing. One of those moments you just stand still for.', 'paris', '2022-10-17'),
    memory('m_nyc_snow', M, 't_nyc22', 'White Christmas', 'Woke up to snow in Manhattan. Coffee from a street cart at 7 am.', 'newyork', '2022-12-24'),
  ],
};
