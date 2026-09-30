import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEMO_CURRENT_USER_ID,
  LOCAL_DATA_VERSION,
  type DataNamespace,
} from '@/constants/app';
import type { UserInput } from '@/models/user';
import { createUser } from '@/services/data/userService';
import {
  clearDatabase,
  emptyDatabase,
  loadDatabase,
  saveWholeDatabase,
} from '@/services/storage/databaseStorage';
import {
  EMPTY_SESSION,
  loadSession,
  saveSession,
  type StoredSession,
} from '@/services/storage/appStorage';

interface SessionContextValue {
  /** False until the stored session has been read. */
  ready: boolean;
  namespace: DataNamespace | null;
  userId: string | null;
  isDemo: boolean;
  /** Enter Demo Mode: no account and no backend needed. */
  startDemo: () => void;
  /** Create the personal (local-only) profile and sign into it. */
  createLocalProfile: (input: UserInput) => Promise<void>;
  /** Sign back into the profile stored on this device. Resolves false when none exists. */
  continueWithLocalProfile: () => Promise<boolean>;
  /** Leave the current data set and go back to onboarding. Data stays on the device. */
  signOut: () => void;
  /** Wipes the local (non-demo) data of this device. */
  deleteLocalData: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession>(EMPTY_SESSION);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSession().then((stored) => {
      setSession(stored);
      setReady(true);
    });
  }, []);

  const change = useCallback((next: StoredSession) => {
    setSession(next);
    void saveSession(next);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      ready,
      namespace: session.namespace,
      userId: session.userId,
      isDemo: session.namespace === 'demo',
      startDemo: () => change({ namespace: 'demo', userId: DEMO_CURRENT_USER_ID }),
      createLocalProfile: async (input) => {
        const existing = (await loadDatabase('local', LOCAL_DATA_VERSION)) ?? emptyDatabase();
        const { db, result } = createUser(existing, input);
        await saveWholeDatabase('local', db, LOCAL_DATA_VERSION);
        change({ namespace: 'local', userId: result.id });
      },
      continueWithLocalProfile: async () => {
        const db = await loadDatabase('local', LOCAL_DATA_VERSION);
        const user = db?.users[0];
        if (!user) return false;
        change({ namespace: 'local', userId: user.id });
        return true;
      },
      signOut: () => change(EMPTY_SESSION),
      deleteLocalData: async () => {
        await clearDatabase('local');
        change(EMPTY_SESSION);
      },
    }),
    [ready, session, change],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
