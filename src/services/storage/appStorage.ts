import { STORAGE_KEYS, type DataNamespace } from '@/constants/app';
import type { ThemeMode } from '@/constants/theme';
import { DEFAULT_NOTIFICATION_PREFERENCES, type NotificationPreferences } from '@/models/social';
import { readJson, writeJson } from './keyValueStore';

/** Which data set is active and who is signed in (locally). */
export interface StoredSession {
  namespace: DataNamespace | null;
  userId: string | null;
}

export const EMPTY_SESSION: StoredSession = { namespace: null, userId: null };

export async function loadSession(): Promise<StoredSession> {
  return (await readJson<StoredSession>(STORAGE_KEYS.session)) ?? EMPTY_SESSION;
}

export const saveSession = (session: StoredSession) => writeJson(STORAGE_KEYS.session, session);

/** Device-level preferences (not part of the travel data). */
export interface StoredSettings {
  themeMode: ThemeMode;
  notifications: NotificationPreferences;
}

export const DEFAULT_SETTINGS: StoredSettings = {
  themeMode: 'system',
  notifications: DEFAULT_NOTIFICATION_PREFERENCES,
};

export async function loadSettings(): Promise<StoredSettings> {
  const stored = await readJson<Partial<StoredSettings>>(STORAGE_KEYS.settings);
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    notifications: { ...DEFAULT_NOTIFICATION_PREFERENCES, ...stored?.notifications },
  };
}

export const saveSettings = (settings: StoredSettings) => writeJson(STORAGE_KEYS.settings, settings);
