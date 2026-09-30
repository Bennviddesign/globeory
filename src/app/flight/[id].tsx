import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { IconButton } from '@/components/common/IconButton';
import { ListRow } from '@/components/common/ListRow';
import { MissingItem } from '@/components/common/MissingItem';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { VisibilityBadge } from '@/components/common/VisibilityBadge';
import { confirmDestructive } from '@/components/modals/confirm';
import { spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import { useScopedDb, useUnit } from '@/context/useTravelData';
import { describeCity, getAirport, getTrip } from '@/services/data/lookup';
import { formatDistance } from '@/services/geo/distance';
import { formatDate, formatTime } from '@/services/util/dates';

/** Flight detail: route, times and the automatically calculated distance (km and miles). */
export default function FlightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();
  const unit = useUnit();
  const { db, currentUserId } = useData();
  const ownerId = db.flights.find((f) => f.id === id)?.user_id;
  const scoped = useScopedDb(ownerId);
  const flight = scoped.flights.find((f) => f.id === id);
  if (!flight) return <MissingItem what="flight" />;

  const dep = getAirport(scoped, flight.departure_airport_id);
  const arr = getAirport(scoped, flight.arrival_airport_id);
  const trip = getTrip(scoped, flight.trip_id);
  const isOwner = flight.user_id === currentUserId;

  const remove = () =>
    confirmDestructive('Delete flight', 'Delete this flight?', 'Delete', () => {
      actions.deleteFlight(flight.id);
      router.back();
    });

  return (
    <Screen bottomInset={48}>
      <ScreenHeader
        title={`${dep?.iata_code ?? '?'} → ${arr?.iata_code ?? '?'}`}
        subtitle={formatDate(flight.departure_datetime.slice(0, 10))}
        back
        right={
          isOwner ? (
            <>
              <IconButton icon="create-outline" accessibilityLabel="Edit flight" filled onPress={() => router.push(`/form/flight?id=${flight.id}`)} />
              <IconButton icon="trash-outline" accessibilityLabel="Delete flight" filled color="#EF4444" onPress={remove} />
            </>
          ) : undefined
        }
      />

      <Card>
        <View style={styles.route}>
          <Airport code={dep?.iata_code} city={describeCity(scoped, dep?.city_id).cityName} time={formatTime(flight.departure_datetime)} />
          <AppText variant="headline" tone="primary">
            ✈
          </AppText>
          <Airport code={arr?.iata_code} city={describeCity(scoped, arr?.city_id).cityName} time={flight.arrival_datetime ? formatTime(flight.arrival_datetime) : ''} />
        </View>
        <View style={styles.distance}>
          <AppText variant="display">{formatDistance(flight.distance_km, unit)}</AppText>
          <AppText tone="muted">{`${formatDistance(flight.distance_km, unit === 'km' ? 'mi' : 'km')} · calculated automatically`}</AppText>
        </View>
      </Card>

      <Card padded={false} style={{ marginTop: spacing.lg }}>
        <View style={{ paddingHorizontal: spacing.md }}>
          {flight.airline ? <ListRow title="Airline" subtitle={flight.airline} icon="business-outline" /> : null}
          {flight.flight_number ? <ListRow title="Flight number" subtitle={flight.flight_number} icon="barcode-outline" /> : null}
          {trip ? (
            <ListRow title="Trip" subtitle={trip.title} icon="briefcase-outline" chevron onPress={() => router.push(`/trip/${trip.id}`)} />
          ) : null}
          <ListRow title="Visibility" right={<VisibilityBadge visibility={flight.visibility} />} icon="eye-outline" />
        </View>
      </Card>

      {flight.notes ? (
        <AppText tone="secondary" style={{ marginTop: spacing.md }}>
          {flight.notes}
        </AppText>
      ) : null}
    </Screen>
  );
}

function Airport({ code, city, time }: { code?: string; city: string; time: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <AppText variant="display">{code ?? '?'}</AppText>
      <AppText variant="small" tone="secondary" numberOfLines={1}>
        {city}
      </AppText>
      {time ? (
        <AppText variant="small" tone="muted">
          {time}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  route: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  distance: { alignItems: 'center', gap: 2, paddingTop: spacing.md },
});
