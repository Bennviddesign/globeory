import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_DATA_VERSION, LOCAL_DATA_VERSION, type DataNamespace } from '@/constants/app';
import type { Database } from '@/models/database';
import type { User } from '@/models/user';
import { enforceInvariants } from '@/services/data/integrityService';
import type { Mutation } from '@/services/data/tables';
import { buildDemoDatabase } from '@/services/demo';
import {
  emptyDatabase,
  loadDatabase,
  saveChangedTables,
  saveWholeDatabase,
} from '@/services/storage/databaseStorage';
import { useSession } from './SessionContext';

interface DataContextValue {
  /** The full local database (own data + demo/other users' data). */
  db: Database;
  /** True once the data set of the active session has been loaded. */
  ready: boolean;
  namespace: DataNamespace | null;
  currentUserId: string | null;
  currentUser: User | null;
  /** Applies a service function that returns `{ db, result }`, persists it and returns the result. */
  mutate: <R>(fn: (db: Database) => Mutation<R>) => R;
  /** Applies a service function that only returns the next database. */
  update: (fn: (db: Database) => Database) => void;
  /** Replaces the demo data set with a fresh copy of the sample data. */
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

async function loadForNamespace(ns: DataNamespace): Promise<Database> {
  if (ns === 'demo') {
    const stored = await loadDatabase('demo', DEMO_DATA_VERSION);
    if (stored) return enforceInvariants(stored);
    const seeded = enforceInvariants(buildDemoDatabase());
    await saveWholeDatabase('demo', seeded, DEMO_DATA_VERSION);
    return seeded;
  }
  const stored = await loadDatabase('local', LOCAL_DATA_VERSION);
  return enforceInvariants(stored ?? emptyDatabase());
}

/**
 * Holds the active database in memory and persists every change to local
 * storage (only the tables that changed). All writes go through services, so
 * business rules (one image per visit, automatic flight distance,
 * notifications) apply no matter which screen triggers them.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const { namespace, userId, ready: sessionReady } = useSession();
  const [db, setDb] = useState<Database>(() => emptyDatabase());
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const activeKey = namespace ?? 'none';
  const dbRef = useRef(db);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const commit = useCallback(
    (next: Database) => {
      const previous = dbRef.current;
      if (next === previous) return;
      dbRef.current = next;
      setDb(next);
      if (!namespace) return;
      // Serialize writes so they never land out of order.
      writeQueue.current = writeQueue.current
        .then(() => saveChangedTables(namespace, previous, next))
        .catch(() => undefined);
    },
    [namespace],
  );

  useEffect(() => {
    if (!sessionReady) return;
    let cancelled = false;
    const load = namespace ? loadForNamespace(namespace) : Promise.resolve(emptyDatabase());
    load.then((loaded) => {
      if (cancelled) return;
      dbRef.current = loaded;
      setDb(loaded);
      setLoadedKey(namespace ?? 'none');
    });
    return () => {
      cancelled = true;
    };
  }, [namespace, sessionReady]);

  const mutate = useCallback(
    <R,>(fn: (current: Database) => Mutation<R>): R => {
      const { db: next, result } = fn(dbRef.current);
      commit(next);
      return result;
    },
    [commit],
  );

  const update = useCallback(
    (fn: (current: Database) => Database) => commit(fn(dbRef.current)),
    [commit],
  );

  const resetDemoData = useCallback(() => {
    if (namespace !== 'demo') return;
    const seeded = enforceInvariants(buildDemoDatabase());
    dbRef.current = seeded;
    setDb(seeded);
    writeQueue.current = writeQueue.current
      .then(() => saveWholeDatabase('demo', seeded, DEMO_DATA_VERSION))
      .catch(() => undefined);
  }, [namespace]);

  const value = useMemo<DataContextValue>(
    () => ({
      db,
      ready: sessionReady && loadedKey === activeKey,
      namespace,
      currentUserId: userId,
      currentUser: db.users.find((u) => u.id === userId) ?? null,
      mutate,
      update,
      resetDemoData,
    }),
    [db, loadedKey, activeKey, sessionReady, namespace, userId, mutate, update, resetDemoData],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
