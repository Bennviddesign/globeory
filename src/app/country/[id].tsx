import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { CityRow } from '@/components/cards/PlaceAggregateRows';
import { AppText } from '@/components/common/AppText';
import { CountryFlag } from '@/components/common/CountryFlag';
import { MissingItem } from '@/components/common/MissingItem';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SectionHeader } from '@/components/common/SectionHeader';
import { spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useScopedDb } from '@/context/useTravelData';
import { aggregateCountries } from '@/services/stats/placeStats';
import { formatDate } from '@/services/util/dates';
import { pluralize } from '@/services/util/text';

/** Country detail: the cities visited in it, with repeat visits aggregated. */
export default function CountryDetailScreen() {
  const { id, owner } = useLocalSearchParams<{ id: string; owner?: string }>();
  const router = useRouter();
  const { currentUserId } = useData();
  const ownerId = owner ?? currentUserId ?? '';
  const scoped = useScopedDb(ownerId);
  const aggregate = useMemo(
    () => aggregateCountries(scoped, ownerId).find((c) => c.country.id === id),
    [scoped, ownerId, id],
  );

  if (!aggregate) return <MissingItem what="country" />;
  const { country } = aggregate;

  return (
    <Screen bottomInset={48}>
      <ScreenHeader title={country.name} back />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <CountryFlag isoCode={country.iso_code} size={44} />
        <View>
          <AppText variant="bodyLarge">
            {pluralize(aggregate.visitCount, 'visit')} · {pluralize(aggregate.totalDays, 'day')}
          </AppText>
          <AppText tone="muted">Last visit {formatDate(aggregate.lastVisitDate)}</AppText>
        </View>
      </View>
      <SectionHeader title={pluralize(aggregate.cities.length, 'city', 'cities')} />
      <View style={{ gap: spacing.sm }}>
        {aggregate.cities.map((c) => (
          <CityRow key={c.city.id} aggregate={c} onPress={() => router.push(`/city/${c.city.id}?owner=${ownerId}`)} />
        ))}
      </View>
    </Screen>
  );
}
