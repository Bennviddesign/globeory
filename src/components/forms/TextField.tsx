import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { FormField } from './FormField';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
}

export function TextField({ label, hint, required, multiline, ...rest }: TextFieldProps) {
  const colors = useColors();
  return (
    <FormField label={label} hint={hint} required={required}>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
        style={[
          styles.input,
          multiline && styles.multiline,
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
        ]}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: MIN_TOUCH + 4,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
  },
  multiline: { minHeight: 104, paddingTop: spacing.md, paddingBottom: spacing.md },
});
