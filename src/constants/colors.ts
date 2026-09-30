/** Raw color palette. Screens never use these directly; they use the theme. */
export const palette = {
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue600: '#2563EB',
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',
  purple500: '#8B5CF6',
  purple400: '#A78BFA',
  green500: '#22C55E',
  green400: '#4ADE80',
  orange500: '#F97316',
  orange400: '#FB923C',
  red500: '#EF4444',
  red400: '#F87171',
  amber500: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  navy950: '#0B1220',
} as const;

/** Category colors (identical in both themes): flights, hotels, places, activities. */
export const categoryColors = {
  flight: palette.blue500,
  hotel: palette.purple500,
  place: palette.green500,
  activity: palette.orange500,
} as const;

export type CategoryKey = keyof typeof categoryColors;
