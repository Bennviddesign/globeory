import { STORAGE_PREFIX, type DataNamespace } from '@/constants/app';
import { PERSISTED_TABLES, type Database, type PersistedTableName } from '@/models/database';
import { getReferenceData } from '../reference';
import { readMany, removeKeys, writeMany } from './keyValueStore';

const tableKey = (ns: DataNamespace, table: PersistedTableName) =>
  `${STORAGE_PREFIX}:${ns}:${table}`;

const initializedKey = (ns: DataNamespace) => `${STORAGE_PREFIX}:${ns}:initialized`;

export function emptyDatabase(): Database {
  return {
    users: [],
    trips: [],
    flights: [],
    destination_visits: [],
    hotels: [],
    places: [],
    activities: [],
    memories: [],
    follows: [],
    notifications: [],
    ...getReferenceData(),
  };
}

/** Loads the persisted tables of a namespace, or `null` when it was never saved. */
export async function loadDatabase(
  ns: DataNamespace,
  expectedVersion: number,
): Promise<Database | null> {
  const [version] = await readMany<number>([initializedKey(ns)]);
  if (version !== expectedVersion) return null;

  const values = await readMany<unknown[]>(PERSISTED_TABLES.map((t) => tableKey(ns, t)));
  const db = emptyDatabase();
  PERSISTED_TABLES.forEach((table, i) => {
    const rows = values[i];
    if (Array.isArray(rows)) (db[table] as unknown[]) = rows;
  });
  return db;
}

/** Writes every persisted table (used for the first save of a namespace). */
export async function saveWholeDatabase(
  ns: DataNamespace,
  db: Database,
  version: number,
): Promise<void> {
  await writeMany([
    [initializedKey(ns), version],
    ...PERSISTED_TABLES.map((t): [string, unknown] => [tableKey(ns, t), db[t]]),
  ]);
}

/** Writes only the tables whose array identity changed since `previous`. */
export async function saveChangedTables(
  ns: DataNamespace,
  previous: Database,
  next: Database,
): Promise<void> {
  const changed = PERSISTED_TABLES.filter((t) => previous[t] !== next[t]);
  await writeMany(changed.map((t): [string, unknown] => [tableKey(ns, t), next[t]]));
}

export async function clearDatabase(ns: DataNamespace): Promise<void> {
  await removeKeys([initializedKey(ns), ...PERSISTED_TABLES.map((t) => tableKey(ns, t))]);
}
