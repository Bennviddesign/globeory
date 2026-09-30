import { Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from './AppText';
import { Icon } from './Icon';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Pill-shaped segmented toggle (Globe | Map, tabs, unit selector, ...). */
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const colors = useColors();
  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={[styles.segment, selected && { backgroundColor: colors.surface }]}
          >
            {option.icon ? (
              <Icon name={option.icon} size={16} color={selected ? colors.primary : colors.textMuted} />
            ) : null}
            <AppText variant="label" style={{ color: selected ? colors.text : colors.textMuted }}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radii.pill, padding: 4 },
  segment: {
    flex: 1,
    minHeight: MIN_TOUCH - 8,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
});
