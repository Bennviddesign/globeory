import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { AppText } from '../common/AppText';

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** Label + control + optional hint. */
export function FormField({ label, hint, required, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <AppText variant="label" tone="secondary">
        {label}
        {required ? ' *' : ''}
      </AppText>
      {children}
      {hint ? (
        <AppText variant="caption" tone="muted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs + 2 },
});
