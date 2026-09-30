import type { User } from '@/models/user';
import { daysAgoIso } from '../util/dates';
import { DEMO_AVATARS } from './demoImages';

function user(
  id: string,
  username: string,
  displayName: string,
  bio: string,
  homeCity: string,
  homeCountry: string,
  visibility: User['profile_visibility'],
  createdDaysAgo: number,
): User {
  const created = daysAgoIso(createdDaysAgo);
  return {
    id,
    username,
    display_name: displayName,
    avatar_url: DEMO_AVATARS[id] ?? null,
    bio,
    home_city: homeCity,
    home_country: homeCountry,
    profile_visibility: visibility,
    preferred_unit: 'km',
    created_at: created,
    updated_at: created,
  };
}

/** Marcus is the signed-in demo user; the others are example public/private profiles. */
export const DEMO_USERS: User[] = [
  user('u_marcus', 'marcus', 'Marcus', 'Collecting cities, one flight at a time.', 'Malmö', 'Sweden', 'public', 900),
  user('u_anna', 'anna_travels', 'Anna Johansson', 'Slow travel, street food and night trains.', 'Stockholm', 'Sweden', 'public', 700),
  user('u_kenji', 'kenji_sato', 'Kenji Sato', 'Tokyo local. Always happy to share hidden spots.', 'Tokyo', 'Japan', 'public', 650),
  user('u_sofia', 'sofia_rossi', 'Sofia Rossi', 'Milan-based. Design, coffee and weekend flights.', 'Milan', 'Italy', 'public', 500),
  user('u_mina', 'mina_park', 'Mina Park', 'Seoul → the world.', 'Seoul', 'South Korea', 'public', 420),
  user('u_elin', 'elin_ny', 'Elin Nyström', 'Sharing trips with friends only.', 'Gothenburg', 'Sweden', 'public', 300),
  user('u_lukas', 'lukas_berg', 'Lukas Berg', 'Private travel diary.', 'Berlin', 'Germany', 'private', 250),
];
