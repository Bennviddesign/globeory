import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useTheme } from '@/context/ThemeContext';
import { formatDate, parseISODate, toISODate } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';
import { FormField } from './FormField';

type Mode = 'date' | 'time';

interface DateTimeFieldProps {
  label: string;
  /** `YYYY-MM-DD` for dates, `HH:mm` for times. Empty string = not set. */
  value: string;
  onChange: (value: string) => void;
  mode?: Mode;
  required?: boolean;
  hint?: string;
  /** Allows clearing an optional value. */
  clearable?: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

function toDate(value: string, mode: Mode): Date {
  if (mode === 'date') return value ? parseISODate(value) : new Date();
  const [h, m] = (value || '12:00').split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function fromDate(date: Date, mode: Mode): string {
  return mode === 'date' ? toISODate(date) : `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Native date / time picker (platform dialog on Android, compact inline
 * picker on iOS). Values are plain strings so they map straight to the model.
 */
export function DateTimeField({ label, value, onChange, mode = 'date', required, hint, clearable }: DateTimeFieldProps) {
  const { theme } = useTheme();
  const { colors, isDark } = theme;
  const [open, setOpen] = useState(false);
  const date = toDate(value, mode);
  const display = value ? (mode === 'date' ? formatDate(value) : value) : 'Select';

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (event.type === 'set' && selected) onChange(fromDate(selected, mode));
  };

  return (
    <FormField label={label} hint={hint} required={required}>
      <View style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {Platform.OS === 'ios' ? (
          <>
            <Icon name={mode === 'date' ? 'calendar-outline' : 'time-outline'} size={18} color={colors.textMuted} />
            <DateTimePicker
              value={date}
              mode={mode}
              display="compact"
              onChange={handleChange}
              accessibilityLabel={label}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          </>
        ) : (
          <Pressable
            style={styles.pressable}
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`${label}: ${display}`}
          >
            <Icon name={mode === 'date' ? 'calendar-outline' : 'time-outline'} size={18} color={colors.textMuted} />
            <AppText style={{ flex: 1 }} tone={value ? 'default' : 'muted'}>
              {display}
            </AppText>
          </Pressable>
        )}
        {clearable && value ? (
          <Pressable onPress={() => onChange('')} accessibilityRole="button" accessibilityLabel={`Clear ${label}`} hitSlop={8}>
            <Icon name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {Platform.OS === 'android' && open ? (
        <DateTimePicker value={date} mode={mode} is24Hour onChange={handleChange} />
      ) : null}
    </FormField>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: MIN_TOUCH + 4,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressable: { flex: 1, minHeight: MIN_TOUCH, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
