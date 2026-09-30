import { categoryColors, palette } from './colors';

export type ThemeName = 'light' | 'dark';
export type ThemeMode = ThemeName | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
  tabBar: string;
  shadow: string;
  /** Globe / map rendering colors. */
  ocean: string;
  oceanGlow: string;
  land: string;
  landStroke: string;
  visited: string;
  graticule: string;
  route: string;
  /** Tinted backgrounds for the four statistic cards. */
  tintBlue: string;
  tintPurple: string;
  tintGreen: string;
  tintOrange: string;
  category: typeof categoryColors;
}

export interface Theme {
  name: ThemeName;
  isDark: boolean;
  colors: ThemeColors;
}

/** Light: off-white background, white cards, dark typography, blue/cyan accents. */
export const lightTheme: Theme = {
  name: 'light',
  isDark: false,
  colors: {
    background: palette.slate50,
    surface: palette.white,
    surfaceElevated: palette.white,
    surfaceMuted: palette.slate100,
    border: palette.slate200,
    text: palette.slate900,
    textSecondary: palette.slate600,
    textMuted: palette.slate500,
    primary: palette.blue500,
    onPrimary: palette.white,
    accent: palette.cyan500,
    success: palette.green500,
    warning: palette.amber500,
    danger: palette.red500,
    overlay: 'rgba(15, 23, 42, 0.45)',
    tabBar: palette.white,
    shadow: '#0F172A',
    ocean: '#EAF2FF',
    oceanGlow: 'rgba(59, 130, 246, 0.18)',
    land: '#CBD9EE',
    landStroke: '#B5C6E0',
    visited: palette.blue500,
    graticule: 'rgba(100, 116, 139, 0.18)',
    route: palette.blue500,
    tintBlue: '#E0EDFF',
    tintPurple: '#EEE7FF',
    tintGreen: '#DCF7E6',
    tintOrange: '#FFE9D6',
    category: categoryColors,
  },
};

/** Dark: deep navy, elevated dark cards, light typography. Designed, not inverted. */
export const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  colors: {
    background: palette.navy950,
    surface: palette.slate800,
    surfaceElevated: '#26344D',
    surfaceMuted: '#16213A',
    border: '#2B3A55',
    text: palette.slate100,
    textSecondary: palette.slate300,
    textMuted: palette.slate400,
    primary: palette.blue400,
    onPrimary: palette.navy950,
    accent: palette.cyan400,
    success: palette.green400,
    warning: palette.amber500,
    danger: palette.red400,
    overlay: 'rgba(2, 6, 23, 0.65)',
    tabBar: '#111A2E',
    shadow: '#000000',
    ocean: '#101B33',
    oceanGlow: 'rgba(34, 211, 238, 0.16)',
    land: '#2A3B5C',
    landStroke: '#36496D',
    visited: palette.cyan400,
    graticule: 'rgba(148, 163, 184, 0.14)',
    route: palette.cyan400,
    tintBlue: 'rgba(59, 130, 246, 0.2)',
    tintPurple: 'rgba(139, 92, 246, 0.22)',
    tintGreen: 'rgba(34, 197, 94, 0.2)',
    tintOrange: 'rgba(249, 115, 22, 0.22)',
    category: categoryColors,
  },
};

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
