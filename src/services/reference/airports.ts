import type { Airport } from '@/models/reference';
import { cityIdFor } from './cities';

/** [IATA, ICAO, name, city key, latitude, longitude] */
const RAW: readonly (readonly [string, string, string, string, number, number])[] = [
  ['MMX', 'ESMS', 'Malmö Airport', 'malmo', 55.5363, 13.3762],
  ['ARN', 'ESSA', 'Stockholm Arlanda Airport', 'stockholm', 59.6519, 17.9186],
  ['GOT', 'ESGG', 'Göteborg Landvetter Airport', 'gothenburg', 57.6628, 12.2798],
  ['CPH', 'EKCH', 'Copenhagen Airport', 'copenhagen', 55.6181, 12.6561],
  ['OSL', 'ENGM', 'Oslo Gardermoen Airport', 'oslo', 60.1976, 11.1004],
  ['BKK', 'VTBS', 'Suvarnabhumi Airport', 'bangkok', 13.69, 100.7501],
  ['USM', 'VTSM', 'Samui Airport', 'kohsamui', 9.5478, 100.0623],
  ['HKT', 'VTSP', 'Phuket International Airport', 'phuket', 8.1132, 98.3169],
  ['CNX', 'VTCC', 'Chiang Mai International Airport', 'chiangmai', 18.7668, 98.9626],
  ['CDG', 'LFPG', 'Charles de Gaulle Airport', 'paris', 49.0097, 2.5479],
  ['NCE', 'LFMN', 'Nice Côte d’Azur Airport', 'nice', 43.6584, 7.2159],
  ['LYS', 'LFLL', 'Lyon–Saint-Exupéry Airport', 'lyon', 45.7256, 5.0811],
  ['MXP', 'LIMC', 'Milan Malpensa Airport', 'milan', 45.63, 8.7231],
  ['FCO', 'LIRF', 'Rome Fiumicino Airport', 'rome', 41.8003, 12.2389],
  ['FLR', 'LIRQ', 'Florence Airport', 'florence', 43.81, 11.2051],
  ['VCE', 'LIPZ', 'Venice Marco Polo Airport', 'venice', 45.5053, 12.2519],
  ['BCN', 'LEBL', 'Barcelona–El Prat Airport', 'barcelona', 41.2974, 2.0833],
  ['MAD', 'LEMD', 'Madrid–Barajas Airport', 'madrid', 40.4983, -3.5676],
  ['SVQ', 'LEZL', 'Seville Airport', 'seville', 37.418, -5.8931],
  ['HND', 'RJTT', 'Tokyo Haneda Airport', 'tokyo', 35.5494, 139.7798],
  ['NRT', 'RJAA', 'Narita International Airport', 'tokyo', 35.772, 140.3929],
  ['KIX', 'RJBB', 'Kansai International Airport', 'osaka', 34.4347, 135.244],
  ['ICN', 'RKSI', 'Incheon International Airport', 'seoul', 37.4602, 126.4407],
  ['PUS', 'RKPK', 'Gimhae International Airport', 'busan', 35.1795, 128.9382],
  ['BER', 'EDDB', 'Berlin Brandenburg Airport', 'berlin', 52.3667, 13.5033],
  ['MUC', 'EDDM', 'Munich Airport', 'munich', 48.3538, 11.7861],
  ['FRA', 'EDDF', 'Frankfurt Airport', 'frankfurt', 50.0379, 8.5622],
  ['LHR', 'EGLL', 'London Heathrow Airport', 'london', 51.47, -0.4543],
  ['AMS', 'EHAM', 'Amsterdam Schiphol Airport', 'amsterdam', 52.3105, 4.7683],
  ['LIS', 'LPPT', 'Lisbon Humberto Delgado Airport', 'lisbon', 38.7742, -9.1342],
  ['OPO', 'LPPR', 'Porto Airport', 'porto', 41.2481, -8.6814],
  ['ATH', 'LGAV', 'Athens Eleftherios Venizelos Airport', 'athens', 37.9364, 23.9445],
  ['JTR', 'LGSR', 'Santorini (Thira) Airport', 'santorini', 36.3992, 25.4793],
  ['JFK', 'KJFK', 'John F. Kennedy International Airport', 'newyork', 40.6413, -73.7781],
  ['LAX', 'KLAX', 'Los Angeles International Airport', 'losangeles', 33.9416, -118.4085],
  ['DXB', 'OMDB', 'Dubai International Airport', 'dubai', 25.2532, 55.3657],
  ['SIN', 'WSSS', 'Singapore Changi Airport', 'singapore', 1.3644, 103.9915],
  ['IST', 'LTFM', 'Istanbul Airport', 'istanbul', 41.2753, 28.7519],
  ['SYD', 'YSSY', 'Sydney Kingsford Smith Airport', 'sydney', -33.9399, 151.1753],
];

export const airportIdFor = (iata: string) => `ap_${iata}`;

export const AIRPORTS: readonly Airport[] = RAW.map(
  ([iata, icao, name, cityKey, latitude, longitude]) => ({
    id: airportIdFor(iata),
    name,
    iata_code: iata,
    icao_code: icao,
    city_id: cityIdFor(cityKey),
    latitude,
    longitude,
  }),
);
