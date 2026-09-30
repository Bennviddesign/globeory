import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import type { DestinationVisit } from '@/models/destinationVisit';
import { daysInclusive, formatDateRange } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { DestinationImage } from '../common/DestinationImage';
import { VisibilityBadge } from '../common/VisibilityBadge';

interface VisitCardProps {
  visit: DestinationVisit;
  subtitle?: string;
  onPress: () => void;
  showVisibility?: boolean;
}

/** One separate occurrence of visiting a city, with its own date and its single image. */
export function VisitCard({ visit, subtitle, onPress, showVisibility }: VisitCardProps) {
  const range = formatDateRange(visit.visit_date, visit.end_date ?? visit.visit_date);
  const days = daysInclusive(visit.visit_date, visit.end_date ?? visit.visit_date);
  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={`${visit.name}, ${range}`}>
      <View style={styles.row}>
        <DestinationImage path={visit.image_path} style={styles.image} />
        <View style={styles.texts}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {visit.name}
          </AppText>
          <AppText variant="small" tone="secondary">
            {range} · {days} {days === 1 ? 'day' : 'days'}
          </AppText>
          {subtitle ? (
            <AppText variant="small" tone="muted" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
          {showVisibility ? <VisibilityBadge visibility={visit.visibility} /> : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, alignItems: 'center' },
  image: { width: 72, height: 72, borderRadius: radii.md },
  texts: { flex: 1, gap: 2 },
});
