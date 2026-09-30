import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface EntryRowProps {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  icon: string;
  color: string;
  onPress?: () => void;
}

/**
 * Generic list card for flights, hotels, places, activities and memories:
 * a colored category icon, a title and one or two lines of detail.
 */
export function EntryRow({ title, subtitle, meta, icon, color, onPress }: EntryRowProps) {
  const colors = useColors();
  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={[title, subtitle, meta].filter(Boolean).join(', ')}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: color + '22' }]}>
          <Icon name={icon} size={20} color={color} />
        </View>
        <View style={styles.texts}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="small" tone="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
          {meta ? (
            <AppText variant="caption" tone="muted" numberOfLines={1}>
              {meta}
            </AppText>
          ) : null}
        </View>
        {onPress ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  icon: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 1 },
});
