import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useColors } from '@/context/ThemeContext';

type IconGlyph = ComponentProps<typeof Ionicons>['name'];

export interface IconProps {
  /** Any Ionicons name. */
  name: string;
  size?: number;
  color?: string;
}

/** Thin icon wrapper so screens do not depend on the icon library directly. */
export function Icon({ name, size = 22, color }: IconProps) {
  const colors = useColors();
  return <Ionicons name={name as IconGlyph} size={size} color={color ?? colors.text} />;
}
