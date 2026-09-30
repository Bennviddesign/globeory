import type { ID } from '@/models/common';
import type { Database } from '@/models/database';
import type { Memory, MemoryInput } from '@/models/memory';
import { emptyToNull } from '../util/text';
import { isValidISODate, nowIso } from '../util/dates';
import { newId } from '../util/id';
import { notifyFollowers } from '../social/notificationService';
import {
  findIn,
  insertInto,
  NotFoundError,
  patchIn,
  removeFrom,
  ValidationError,
  type Mutation,
} from './tables';

function clean(input: MemoryInput): MemoryInput {
  if (!input.title.trim()) throw new ValidationError('Give the memory a title.');
  if (!isValidISODate(input.date)) throw new ValidationError('A date is required.');
  return { ...input, title: input.title.trim(), description: emptyToNull(input.description) };
}

export function createMemory(db: Database, userId: ID, input: MemoryInput): Mutation<Memory> {
  const now = nowIso();
  const memory: Memory = { ...clean(input), id: newId('memory'), user_id: userId, created_at: now, updated_at: now };
  let next = insertInto(db, 'memories', memory);
  next = notifyFollowers(next, userId, 'memory_added', memory.id, memory.visibility);
  return { db: next, result: memory };
}

export function updateMemory(db: Database, id: ID, input: MemoryInput): Mutation<Memory> {
  if (!findIn(db, 'memories', id)) throw new NotFoundError('memory', id);
  const next = patchIn(db, 'memories', id, { ...clean(input), updated_at: nowIso() });
  return { db: next, result: findIn(next, 'memories', id)! };
}

export function deleteMemory(db: Database, id: ID): Database {
  return removeFrom(db, 'memories', id);
}
