import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
}

/** Settings / list row with optional icon, subtitle and trailing control. */
export function ListRow({
  title,
  subtitle,
  icon,
  iconColor,
  left,
  right,
  onPress,
  chevron = false,
  destructive = false,
}: ListRowProps) {
  const colors = useColors();
  const content = (
    <View style={styles.row}>
      {left ??
        (icon ? (
          <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
            <Icon name={icon} size={18} color={iconColor ?? (destructive ? colors.danger : colors.primary)} />
          </View>
        ) : null)}
      <View style={styles.texts}>
        <AppText variant="bodyLarge" tone={destructive ? 'danger' : 'default'}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      {chevron ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </View>
  );

  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {content}
    </Pressable>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  row: { minHeight: MIN_TOUCH + 8, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  iconWrap: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
});
