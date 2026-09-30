import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import type { TimelineItem } from '@/services/timeline/globalTimeline';
import { formatDateRange } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { CountryFlag } from '../common/CountryFlag';
import { DestinationImage } from '../common/DestinationImage';
import { VisibilityBadge } from '../common/VisibilityBadge';

interface TimelineCardProps {
  item: TimelineItem;
  onPress: () => void;
  showVisibility?: boolean;
}

/** Wide timeline card: image, flag, destination, dates, duration and the cities visited. */
export function TimelineCard({ item, onPress, showVisibility = false }: TimelineCardProps) {
  const isTrip = item.kind === 'trip';
  const title = isTrip ? item.trip.title : item.visit.name;
  const start = isTrip ? item.trip.start_date : item.visit.visit_date;
  const end = isTrip ? item.trip.end_date : (item.visit.end_date ?? item.visit.visit_date);
  const visibility = isTrip ? item.trip.visibility : item.visit.visibility;
  const dateRange = formatDateRange(start, end);
  const days = `${item.days} ${item.days === 1 ? 'day' : 'days'}`;

  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={`${title}, ${dateRange}, ${days}`}>
      <DestinationImage path={item.coverImage} size="medium" style={styles.image} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {item.countries[0] ? <CountryFlag isoCode={item.countries[0].isoCode} size={18} /> : null}
          <AppText variant="bodyLarge" numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </AppText>
        </View>
        <AppText variant="small" tone="secondary">
          {dateRange} · {days}
        </AppText>
        {item.cities.length > 0 ? (
          <AppText variant="small" tone="muted" numberOfLines={1}>
            {item.cities.join(' · ')}
          </AppText>
        ) : null}
        {showVisibility ? <VisibilityBadge visibility={visibility} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { height: 132, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg },
  body: { padding: spacing.md, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
