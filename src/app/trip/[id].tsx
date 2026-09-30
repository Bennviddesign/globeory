import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { CountryFlag } from '@/components/common/CountryFlag';
import { DestinationImage } from '@/components/common/DestinationImage';
import { IconButton } from '@/components/common/IconButton';
import { MissingItem } from '@/components/common/MissingItem';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/StateViews';
import { VisibilityBadge } from '@/components/common/VisibilityBadge';
import { TripTimelineList } from '@/components/timeline/TripTimelineList';
import { radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import { useScopedDb, useUnit } from '@/context/useTravelData';
import { getTrip } from '@/services/data/lookup';
import { formatDistance } from '@/services/geo/distance';
import { buildTripTimeline } from '@/services/timeline/tripTimeline';
import { buildGlobalTimeline } from '@/services/timeline/globalTimeline';
import { daysInclusive, formatDateRange } from '@/services/util/dates';
import { pluralize } from '@/services/util/text';

/** Trip detail (spec section 11): overview + chronological trip timeline. */
export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const unit = useUnit();
  const actions = useActions();
  const { db, currentUserId } = useData();
  const ownerId = getTrip(db, id)?.user_id;
  const scoped = useScopedDb(ownerId);
  const trip = getTrip(scoped, id);

  const entries = useMemo(() => (trip ? buildTripTimeline(scoped, trip.id) : []), [scoped, trip]);
  const summary = useMemo(() => {
    if (!trip) return null;
    const item = buildGlobalTimeline(scoped, trip.user_id)
      .flatMap((y) => y.items)
      .find((i) => i.kind === 'trip' && i.trip.id === trip.id);
    const flights = scoped.flights.filter((f) => f.trip_id === trip.id);
    return {
      countries: item?.countries ?? [],
      cover: item?.coverImage ?? null,
      flights: flights.length,
      distanceKm: flights.reduce((sum, f) => sum + f.distance_km, 0),
    };
  }, [scoped, trip]);

  if (!trip || !summary) return <MissingItem what="trip" />;
  const isOwner = trip.user_id === currentUserId;

  const askDelete = () =>
    Alert.alert('Delete trip', 'What should happen to the flights, hotels and destinations in this trip?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Keep them',
        onPress: () => {
          actions.deleteTrip(trip.id, 'detach');
          router.back();
        },
      },
      {
        text: 'Delete everything',
        style: 'destructive',
        onPress: () => {
          actions.deleteTrip(trip.id, 'cascade');
          router.back();
        },
      },
    ]);

  const addToTrip = (kind: string) => router.push(`/form/${kind}?tripId=${trip.id}`);

  return (
    <Screen bottomInset={48}>
      <ScreenHeader
        title={trip.title}
        subtitle={formatDateRange(trip.start_date, trip.end_date)}
        back
        right={
          isOwner ? (
            <>
              <IconButton icon="create-outline" accessibilityLabel="Edit trip" filled onPress={() => router.push(`/form/trip?id=${trip.id}`)} />
              <IconButton icon="trash-outline" accessibilityLabel="Delete trip" filled color="#EF4444" onPress={askDelete} />
            </>
          ) : undefined
        }
      />

      <DestinationImage path={summary.cover} size="medium" style={styles.cover} />

      <View style={styles.meta}>
        <View style={styles.flags}>
          {summary.countries.map((c) => (
            <CountryFlag key={c.isoCode} isoCode={c.isoCode} size={22} />
          ))}
        </View>
        <VisibilityBadge visibility={trip.visibility} />
      </View>
      {trip.description ? (
        <AppText tone="secondary" style={{ marginTop: spacing.sm }}>
          {trip.description}
        </AppText>
      ) : null}

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.summary}>
          <Summary label="Days" value={String(daysInclusive(trip.start_date, trip.end_date))} />
          <Summary label="Flights" value={String(summary.flights)} />
          <Summary label="Distance" value={formatDistance(summary.distanceKm, unit)} />
        </View>
      </Card>

      <SectionHeader title={`Timeline · ${pluralize(entries.length, 'entry', 'entries')}`} />
      {entries.length === 0 ? (
        <EmptyState
          title="Nothing added yet"
          message="Add flights, hotels, destinations and memories to build this trip."
          icon="map-outline"
        />
      ) : (
        <TripTimelineList entries={entries} onOpen={(entry) => router.push(entry.href as never)} />
      )}

      {isOwner ? (
        <View style={styles.adders}>
          <Button label="Add destination" variant="secondary" icon="location-outline" onPress={() => addToTrip('visit')} />
          <Button label="Add flight" variant="secondary" icon="airplane-outline" onPress={() => addToTrip('flight')} />
          <Button label="Add hotel" variant="secondary" icon="bed-outline" onPress={() => addToTrip('hotel')} />
          <Button label="Add place" variant="secondary" icon="pin-outline" onPress={() => addToTrip('place')} />
          <Button label="Add activity" variant="secondary" icon="walk-outline" onPress={() => addToTrip('activity')} />
          <Button label="Add memory" variant="secondary" icon="heart-outline" onPress={() => addToTrip('memory')} />
        </View>
      ) : null}
    </Screen>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <AppText variant="title">{value}</AppText>
      <AppText variant="small" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 190, borderRadius: radii.lg },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  flags: { flexDirection: 'row', gap: spacing.xs },
  summary: { flexDirection: 'row' },
  adders: { gap: spacing.sm, marginTop: spacing.xl },
});
