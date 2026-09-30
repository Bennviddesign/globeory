import { Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { TripTimelineEntry } from '@/services/timeline/tripTimeline';
import { formatDayMonth } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';

interface TripTimelineListProps {
  entries: TripTimelineEntry[];
  onOpen: (entry: TripTimelineEntry) => void;
}

/** `11 Apr  ✈ Copenhagen → Bangkok`, `11 Apr  🏨 Hotel check-in`, ... sorted by date/time. */
export function TripTimelineList({ entries, onOpen }: TripTimelineListProps) {
  const colors = useColors();
  const colorFor = (entry: TripTimelineEntry) => {
    switch (entry.category) {
      case 'flight':
      case 'hotel':
      case 'place':
      case 'activity':
        return colors.category[entry.category];
      case 'memory':
        return '#EC4899';
      default:
        return colors.primary;
    }
  };

  return (
    <View>
      {entries.map((entry, index) => {
        const showDate = index === 0 || entries[index - 1].date !== entry.date;
        const color = colorFor(entry);
        return (
          <Pressable
            key={entry.key}
            onPress={() => onOpen(entry)}
            accessibilityRole="button"
            accessibilityLabel={`${formatDayMonth(entry.date)}, ${entry.title}`}
            style={styles.row}
          >
            <View style={styles.date}>
              <AppText variant="label" tone={showDate ? 'default' : 'muted'} style={{ opacity: showDate ? 1 : 0 }}>
                {formatDayMonth(entry.date)}
              </AppText>
            </View>
            <View style={styles.rail}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <View style={[styles.node, { backgroundColor: color + '22' }]}>
                <Icon name={entry.icon} size={14} color={color} />
              </View>
            </View>
            <View style={styles.texts}>
              <AppText variant="body" style={{ fontWeight: '600' }} numberOfLines={2}>
                {entry.title}
              </AppText>
              {entry.subtitle ? (
                <AppText variant="small" tone="muted" numberOfLines={1}>
                  {entry.subtitle}
                </AppText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: MIN_TOUCH + 12, gap: spacing.sm },
  date: { width: 52, paddingTop: 6 },
  rail: { width: 28, alignItems: 'center' },
  line: { position: 'absolute', top: 0, bottom: 0, width: 2 },
  node: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  texts: { flex: 1, paddingBottom: spacing.md, paddingTop: 4, gap: 1 },
});
