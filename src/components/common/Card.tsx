import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accessibilityLabel?: string;
}

/** Rounded surface. Light theme uses a soft shadow, dark theme an elevated tone + hairline border. */
export function Card({ children, onPress, style, padded = true, accessibilityLabel }: CardProps) {
  const { theme } = useTheme();
  const { colors, isDark } = theme;
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: isDark ? 0 : 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: isDark ? 0 : 2,
    padding: padded ? spacing.lg : 0,
    overflow: 'hidden',
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View accessibilityLabel={accessibilityLabel} style={[base, style]}>
      {children}
    </View>
  );
}
