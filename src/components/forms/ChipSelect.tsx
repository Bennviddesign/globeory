import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { FilterChip } from '../common/FilterChip';
import { FormField } from './FormField';

interface ChipSelectProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  hint?: string;
}

/** Single choice as wrapping chips (activity type, place type, ...). */
export function ChipSelect<T extends string>({ label, options, value, onChange, hint }: ChipSelectProps<T>) {
  return (
    <FormField label={label} hint={hint}>
      <View style={styles.wrap}>
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={option.value === value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
