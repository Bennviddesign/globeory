import { Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from './AppText';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Category color dot (Flights blue, Hotels purple, ...). */
  dotColor?: string;
}

export function FilterChip({ label, selected, onPress, dotColor }: FilterChipProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter: ${label}`}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <AppText variant="label" style={{ color: selected ? colors.onPrimary : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: MIN_TOUCH - 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
