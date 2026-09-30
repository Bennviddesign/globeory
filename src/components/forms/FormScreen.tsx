import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { Button } from '../common/Button';
import { Screen } from '../common/Screen';
import { ScreenHeader } from '../common/ScreenHeader';

interface FormScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  saveLabel?: string;
  onSave: () => void;
  saving?: boolean;
  /** Shown for existing records. */
  onDelete?: () => void;
  deleteLabel?: string;
}

/** Shared layout of all Add / Edit forms: header with close, fields, Save, optional Delete. */
export function FormScreen({
  title,
  subtitle,
  children,
  saveLabel = 'Save',
  onSave,
  saving,
  onDelete,
  deleteLabel = 'Delete',
}: FormScreenProps) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen bottomInset={48} edges={['top', 'bottom']}>
        <ScreenHeader title={title} subtitle={subtitle} close />
        <View style={styles.fields}>{children}</View>
        <View style={styles.actions}>
          <Button label={saveLabel} onPress={onSave} loading={saving} />
          {onDelete ? <Button label={deleteLabel} variant="danger" onPress={onDelete} /> : null}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.lg, paddingTop: spacing.sm },
  actions: { gap: spacing.md, marginTop: spacing.xxl },
});
