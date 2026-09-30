import type { ID } from '@/models/common';
import type { Database, TableName } from '@/models/database';

export type RowOf<K extends TableName> = Database[K][number];

/** Result of a mutation: the next database plus the affected row. */
export interface Mutation<R> {
  db: Database;
  result: R;
}

export function insertInto<K extends TableName>(db: Database, table: K, row: RowOf<K>): Database {
  return { ...db, [table]: [...(db[table] as RowOf<K>[]), row] };
}

export function patchIn<K extends TableName>(
  db: Database,
  table: K,
  id: ID,
  patch: Partial<RowOf<K>>,
): Database {
  const rows = db[table] as (RowOf<K> & { id: ID })[];
  return { ...db, [table]: rows.map((row) => (row.id === id ? { ...row, ...patch } : row)) };
}

export function removeFrom<K extends TableName>(db: Database, table: K, id: ID): Database {
  const rows = db[table] as (RowOf<K> & { id: ID })[];
  return { ...db, [table]: rows.filter((row) => row.id !== id) };
}

export function findIn<K extends TableName>(db: Database, table: K, id: ID): RowOf<K> | undefined {
  return (db[table] as (RowOf<K> & { id: ID })[]).find((row) => row.id === id);
}

export class NotFoundError extends Error {
  constructor(table: string, id: string) {
    super(`${table} ${id} was not found`);
  }
}

export class ValidationError extends Error {}
