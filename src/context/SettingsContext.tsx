import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@/constants/theme';
import type { NotificationPreferences } from '@/models/social';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type StoredSettings,
} from '@/services/storage/appStorage';

interface SettingsContextValue extends StoredSettings {
  ready: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/** Device-level settings: theme mode (light / dark / system) and notification preferences. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSettings().then((stored) => {
      setSettings(stored);
      setReady(true);
    });
  }, []);

  const update = useCallback((updater: (prev: StoredSettings) => StoredSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      void saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      ready,
      setThemeMode: (themeMode) => update((prev) => ({ ...prev, themeMode })),
      setNotificationPreference: (key, enabled) =>
        update((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: enabled } })),
    }),
    [settings, ready, update],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
