import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { TimelineItem, TimelineYear } from '@/services/timeline/globalTimeline';
import { AppText } from '../common/AppText';
import { TimelineCard } from '../cards/TimelineCard';

interface GlobalTimelineListProps {
  years: TimelineYear[];
  onOpen: (item: TimelineItem) => void;
  showVisibility?: boolean;
}

/**
 * The global timeline (spec section 10): a continuous vertical line, year
 * markers (2026, 2025, ...) and one wide card per trip / standalone visit.
 */
export function GlobalTimelineList({ years, onOpen, showVisibility }: GlobalTimelineListProps) {
  const colors = useColors();
  return (
    <View>
      {years.map((group) => (
        <View key={group.year}>
          <View style={styles.yearRow}>
            <View style={styles.rail}>
              <View style={[styles.line, { backgroundColor: colors.primary }]} />
              <View style={[styles.yearDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />
            </View>
            <AppText variant="title" accessibilityRole="header">
              {group.year}
            </AppText>
          </View>
          {group.items.map((item) => (
            <View key={item.key} style={styles.itemRow}>
              <View style={styles.rail}>
                <View style={[styles.line, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.background, borderColor: colors.primary }]} />
              </View>
              <View style={styles.card}>
                <TimelineCard item={item} onPress={() => onOpen(item)} showVisibility={showVisibility} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 40 },
  itemRow: { flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.lg },
  rail: { width: 20, alignItems: 'center' },
  line: { position: 'absolute', top: 0, bottom: -spacing.lg, width: 2, opacity: 0.35 },
  yearDot: { position: 'absolute', top: 12, width: 16, height: 16, borderRadius: 8, borderWidth: 3 },
  dot: { position: 'absolute', top: 14, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  card: { flex: 1 },
});
