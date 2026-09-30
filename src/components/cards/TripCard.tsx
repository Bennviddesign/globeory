import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import type { Trip } from '@/models/trip';
import { formatDateRange } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { CountryFlag } from '../common/CountryFlag';
import { DestinationImage } from '../common/DestinationImage';

interface TripCardProps {
  trip: Trip;
  coverImage: string | null;
  countries: { isoCode: string; name: string }[];
  onPress: () => void;
}

/** Compact trip card for "Recent trips" (flag, name, date range). */
export function TripCard({ trip, coverImage, countries, onPress }: TripCardProps) {
  const dateRange = formatDateRange(trip.start_date, trip.end_date);
  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={`${trip.title}, ${dateRange}`}>
      <View style={styles.row}>
        <DestinationImage path={coverImage} style={styles.image} />
        <View style={styles.texts}>
          <View style={styles.flags}>
            {countries.slice(0, 3).map((c) => (
              <CountryFlag key={c.isoCode} isoCode={c.isoCode} size={16} />
            ))}
          </View>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {trip.title}
          </AppText>
          <AppText variant="small" tone="muted">
            {dateRange}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  image: { width: 64, height: 64, borderRadius: radii.md },
  texts: { flex: 1, gap: 2 },
  flags: { flexDirection: 'row', gap: 4 },
});
