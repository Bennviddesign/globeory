import type { ID, ProfileVisibility } from '@/models/common';
import type { Database } from '@/models/database';
import { USERNAME_PATTERN, type User, type UserInput } from '@/models/user';
import { nowIso } from '../util/dates';
import { newId } from '../util/id';
import { emptyToNull } from '../util/text';
import { findIn, insertInto, NotFoundError, patchIn, ValidationError, type Mutation } from './tables';

function clean(db: Database, input: UserInput, selfId?: ID): UserInput {
  const username = input.username.trim().replace(/^@/, '').toLowerCase();
  if (!USERNAME_PATTERN.test(username)) {
    throw new ValidationError('Username must be 3-24 characters: letters, numbers or underscores.');
  }
  if (db.users.some((u) => u.username === username && u.id !== selfId)) {
    throw new ValidationError('That username is already taken.');
  }
  if (!input.display_name.trim()) throw new ValidationError('Enter your name.');
  return {
    ...input,
    username,
    display_name: input.display_name.trim(),
    bio: emptyToNull(input.bio),
    home_city: emptyToNull(input.home_city),
    home_country: emptyToNull(input.home_country),
    avatar_url: input.avatar_url || null,
  };
}

/** Creates the local profile used outside Demo Mode. */
export function createUser(db: Database, input: UserInput): Mutation<User> {
  const now = nowIso();
  const user: User = { ...clean(db, input), id: newId('user'), created_at: now, updated_at: now };
  return { db: insertInto(db, 'users', user), result: user };
}

export function updateUser(db: Database, id: ID, input: UserInput): Mutation<User> {
  if (!findIn(db, 'users', id)) throw new NotFoundError('user', id);
  const next = patchIn(db, 'users', id, { ...clean(db, input, id), updated_at: nowIso() });
  return { db: next, result: findIn(next, 'users', id)! };
}

export function setProfileVisibility(db: Database, id: ID, value: ProfileVisibility): Database {
  return patchIn(db, 'users', id, { profile_visibility: value, updated_at: nowIso() });
}

export function setPreferredUnit(db: Database, id: ID, unit: User['preferred_unit']): Database {
  return patchIn(db, 'users', id, { preferred_unit: unit, updated_at: nowIso() });
}
