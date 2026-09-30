import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { themes, type Theme, type ThemeMode, type ThemeName } from '@/constants/theme';
import { useSettings } from './SettingsContext';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Resolves Light / Dark / System into the active theme. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { themeMode, setThemeMode } = useSettings();
  const system = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const name: ThemeName = themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;
    return { theme: themes[name], mode: themeMode, setMode: setThemeMode };
  }, [themeMode, system, setThemeMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Shortcut for components that only need the color tokens. */
export function useColors() {
  return useTheme().theme.colors;
}
