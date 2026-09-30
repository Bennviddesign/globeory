import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import type { CityAggregate, CountryAggregate } from '@/services/stats/placeStats';
import { formatDate } from '@/services/util/dates';
import { pluralize } from '@/services/util/text';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { CountryFlag } from '../common/CountryFlag';
import { DestinationImage } from '../common/DestinationImage';

/** Places > Countries row: `🇹🇭 Thailand · 3 visits · 87 days · 6 cities`. */
export function CountryRow({ aggregate, onPress }: { aggregate: CountryAggregate; onPress: () => void }) {
  const { country } = aggregate;
  return (
    <Card onPress={onPress} accessibilityLabel={`${country.name}, ${pluralize(aggregate.visitCount, 'visit')}`}>
      <View style={styles.row}>
        <CountryFlag isoCode={country.iso_code} size={32} />
        <View style={styles.texts}>
          <AppText variant="bodyLarge">{country.name}</AppText>
          <AppText variant="small" tone="secondary">
            {pluralize(aggregate.visitCount, 'visit')} · {pluralize(aggregate.totalDays, 'day')} ·{' '}
            {pluralize(aggregate.cities.length, 'city', 'cities')}
          </AppText>
          <AppText variant="caption" tone="muted">
            Last visit {formatDate(aggregate.lastVisitDate)}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

/** Places > Cities row: repeated visits are aggregated to a count, history lives in the detail. */
export function CityRow({ aggregate, onPress }: { aggregate: CityAggregate; onPress: () => void }) {
  const image = aggregate.visits.find((v) => v.image_path)?.image_path ?? null;
  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={`${aggregate.city.name}, ${pluralize(aggregate.visits.length, 'visit')}`}>
      <View style={[styles.row, { padding: spacing.md }]}>
        <DestinationImage path={image} style={styles.thumb} />
        <View style={styles.texts}>
          <AppText variant="bodyLarge">{aggregate.city.name}</AppText>
          <AppText variant="small" tone="secondary">
            {aggregate.country?.name} · {pluralize(aggregate.visits.length, 'visit')}
          </AppText>
          <AppText variant="caption" tone="muted">
            Last visit {formatDate(aggregate.lastVisitDate)}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texts: { flex: 1, gap: 2 },
  thumb: { width: 56, height: 56, borderRadius: 12 },
});
