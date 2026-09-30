import type { Activity, ActivityInput } from '@/models/activity';
import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import { emptyToNull } from '../util/text';
import { isValidISODate, nowIso } from '../util/dates';
import { newId } from '../util/id';
import { notifyFollowers } from '../social/notificationService';
import { getCity } from './lookup';
import {
  findIn,
  insertInto,
  NotFoundError,
  patchIn,
  removeFrom,
  ValidationError,
  type Mutation,
} from './tables';

function clean(db: Database, input: ActivityInput): ActivityInput {
  if (!input.name.trim()) throw new ValidationError('Give the activity a name.');
  if (!getCity(db, input.city_id)) throw new ValidationError('Choose a city for the activity.');
  if (!isValidISODate(input.date)) throw new ValidationError('A date is required.');
  return { ...input, name: input.name.trim(), description: emptyToNull(input.description) };
}

export function createActivity(db: Database, userId: ID, input: ActivityInput): Mutation<Activity> {
  const activity: Activity = {
    ...clean(db, input),
    id: newId('activity'),
    user_id: userId,
    created_at: nowIso(),
  };
  let next = insertInto(db, 'activities', activity);
  next = notifyFollowers(next, userId, 'activity_added', activity.id, activity.visibility);
  return { db: next, result: activity };
}

export function updateActivity(db: Database, id: ID, input: ActivityInput): Mutation<Activity> {
  if (!findIn(db, 'activities', id)) throw new NotFoundError('activity', id);
  const next = patchIn(db, 'activities', id, clean(db, input));
  return { db: next, result: findIn(next, 'activities', id)! };
}

export function deleteActivity(db: Database, id: ID): Database {
  return removeFrom(db, 'activities', id);
}
