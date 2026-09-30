import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityRow, PlaceRow } from '@/components/cards/ActivityRow';
import { HotelRow } from '@/components/cards/HotelRow';
import { VisitCard } from '@/components/cards/VisitCard';
import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { CountryFlag } from '@/components/common/CountryFlag';
import { DestinationImage } from '@/components/common/DestinationImage';
import { MissingItem } from '@/components/common/MissingItem';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SectionHeader } from '@/components/common/SectionHeader';
import { radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useScopedDb } from '@/context/useTravelData';
import { describeCity } from '@/services/data/lookup';
import { visitsForCity } from '@/services/data/visitService';
import { formatDateRange } from '@/services/util/dates';
import { pluralize } from '@/services/util/text';

/**
 * City detail: every separate visit to a city, newest first. Milan visited
 * three times shows three visits here, each with its own image.
 */
export default function CityDetailScreen() {
  const { id, owner } = useLocalSearchParams<{ id: string; owner?: string }>();
  const router = useRouter();
  const { currentUserId } = useData();
  const ownerId = owner ?? currentUserId ?? '';
  const scoped = useScopedDb(ownerId);
  const place = describeCity(scoped, id);

  const visits = useMemo(() => visitsForCity(scoped, ownerId, id), [scoped, ownerId, id]);
  const hotels = scoped.hotels.filter((h) => h.user_id === ownerId && h.city_id === id);
  const places = scoped.places.filter((p) => p.user_id === ownerId && p.city_id === id);
  const activities = scoped.activities.filter((a) => a.user_id === ownerId && a.city_id === id);
  const hero = visits.find((v) => v.image_path)?.image_path ?? null;

  if (!place.city) return <MissingItem what="city" />;
  const isOwner = ownerId === currentUserId;

  return (
    <Screen bottomInset={48}>
      <ScreenHeader title={place.cityName} subtitle={place.countryName} back />
      <DestinationImage path={hero} size="medium" style={styles.hero} />
      <View style={styles.meta}>
        <CountryFlag isoCode={place.isoCode} size={22} />
        <AppText variant="bodyLarge">{place.text}</AppText>
        <AppText tone="muted">· {pluralize(visits.length, 'visit')}</AppText>
      </View>

      <SectionHeader title="Visit history" />
      <View style={{ gap: spacing.sm }}>
        {visits.map((v) => (
          <VisitCard
            key={v.id}
            visit={v}
            subtitle={formatDateRange(v.visit_date, v.end_date ?? v.visit_date)}
            onPress={() => router.push(`/visit/${v.id}`)}
          />
        ))}
      </View>
      {isOwner ? (
        <View style={{ marginTop: spacing.md }}>
          <Button label="Add another visit" variant="secondary" icon="add" onPress={() => router.push(`/form/visit?cityId=${id}`)} />
        </View>
      ) : null}

      {hotels.length > 0 ? (
        <Section title="Hotels">
          {hotels.map((h) => (
            <HotelRow key={h.id} db={scoped} hotel={h} onPress={isOwner ? () => router.push(`/form/hotel?id=${h.id}`) : undefined} />
          ))}
        </Section>
      ) : null}
      {places.length > 0 ? (
        <Section title="Places">
          {places.map((p) => (
            <PlaceRow key={p.id} db={scoped} place={p} onPress={isOwner ? () => router.push(`/form/place?id=${p.id}`) : undefined} />
          ))}
        </Section>
      ) : null}
      {activities.length > 0 ? (
        <Section title="Activities">
          {activities.map((a) => (
            <ActivityRow key={a.id} db={scoped} activity={a} onPress={isOwner ? () => router.push(`/form/activity?id=${a.id}`) : undefined} />
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <SectionHeader title={title} />
      <View style={{ gap: spacing.sm }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 200, borderRadius: radii.lg },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.md },
});
