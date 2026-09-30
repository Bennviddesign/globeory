import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityRow } from '@/components/cards/ActivityRow';
import { HotelRow } from '@/components/cards/HotelRow';
import { CityRow, CountryRow } from '@/components/cards/PlaceAggregateRows';
import { Card } from '@/components/common/Card';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/common/StateViews';
import { FilterChip } from '@/components/common/FilterChip';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useScopedDb, useStats } from '@/context/useTravelData';
import { describeCity } from '@/services/data/lookup';
import { aggregateCities, aggregateCountries } from '@/services/stats/placeStats';

const TABS = [
  { key: 'countries', label: 'Countries' },
  { key: 'cities', label: 'Cities' },
  { key: 'airports', label: 'Airports' },
  { key: 'hotels', label: 'Hotels' },
  { key: 'activities', label: 'Activities' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

function isTabKey(value: string | undefined): value is TabKey {
  return TABS.some((t) => t.key === value);
}

/** Places (spec section 11): Countries | Cities | Airports | Hotels | Activities. */
export default function PlacesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { currentUserId } = useData();
  const scoped = useScopedDb(currentUserId);
  const stats = useStats(currentUserId);
  const [tab, setTab] = useState<TabKey>(isTabKey(params.tab) ? params.tab : 'countries');

  // Follow `?tab=` changes (e.g. tapping a stat on Explore) without an effect.
  const [seenParam, setSeenParam] = useState(params.tab);
  if (params.tab !== seenParam) {
    setSeenParam(params.tab);
    if (isTabKey(params.tab)) setTab(params.tab);
  }

  const owner = currentUserId ?? '';
  const countries = useMemo(() => aggregateCountries(scoped, owner), [scoped, owner]);
  const cities = useMemo(() => aggregateCities(scoped, owner), [scoped, owner]);
  const hotels = useMemo(
    () => scoped.hotels.filter((h) => h.user_id === owner).sort((a, b) => b.check_in.localeCompare(a.check_in)),
    [scoped, owner],
  );
  const activities = useMemo(
    () => scoped.activities.filter((a) => a.user_id === owner).sort((a, b) => b.date.localeCompare(a.date)),
    [scoped, owner],
  );

  const empty = (title: string) => <EmptyState title={title} icon="location-outline" message="Add a trip or a destination to fill this list." />;

  const renderBody = () => {
    switch (tab) {
      case 'countries':
        return countries.length === 0
          ? empty('No countries yet')
          : countries.map((c) => (
              <CountryRow key={c.country.id} aggregate={c} onPress={() => router.push(`/country/${c.country.id}`)} />
            ));
      case 'cities':
        return cities.length === 0
          ? empty('No cities yet')
          : cities.map((c) => <CityRow key={c.city.id} aggregate={c} onPress={() => router.push(`/city/${c.city.id}`)} />);
      case 'airports':
        return stats.airportsVisited.length === 0
          ? empty('No airports yet')
          : stats.airportsVisited.map((a) => (
              <Card key={a.id}>
                <View style={styles.airport}>
                  <AppText variant="title" tone="primary" style={styles.iata}>
                    {a.iata_code}
                  </AppText>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyLarge" numberOfLines={1}>
                      {a.name}
                    </AppText>
                    <AppText variant="small" tone="secondary">
                      {describeCity(scoped, a.city_id).text}
                    </AppText>
                  </View>
                </View>
              </Card>
            ));
      case 'hotels':
        return hotels.length === 0
          ? empty('No hotels yet')
          : hotels.map((h) => (
              <HotelRow key={h.id} db={scoped} hotel={h} onPress={() => router.push(`/form/hotel?id=${h.id}`)} />
            ));
      case 'activities':
        return activities.length === 0
          ? empty('No activities yet')
          : activities.map((a) => (
              <ActivityRow key={a.id} db={scoped} activity={a} onPress={() => router.push(`/form/activity?id=${a.id}`)} />
            ));
    }
  };

  return (
    <Screen bottomInset={48}>
      <ScreenHeader title="Places" subtitle="Everywhere you have been" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((t) => (
          <FilterChip key={t.key} label={t.label} selected={tab === t.key} onPress={() => setTab(t.key)} />
        ))}
      </ScrollView>
      <View style={styles.list}>{renderBody()}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { gap: spacing.sm, paddingBottom: spacing.md },
  list: { gap: spacing.sm },
  airport: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iata: { width: 52, fontWeight: '800' },
});
