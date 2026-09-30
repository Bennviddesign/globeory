import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { VisitCard } from '@/components/cards/VisitCard';
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
import { VisibilityBadge } from '@/components/common/VisibilityBadge';
import { confirmDestructive, showError } from '@/components/modals/confirm';
import { radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import { useScopedDb } from '@/context/useTravelData';
import { describeCity, getTrip, getVisit } from '@/services/data/lookup';
import { visitsForCity } from '@/services/data/visitService';
import { pickRepresentativeImage } from '@/services/images/imageService';
import { formatDateRange } from '@/services/util/dates';

/**
 * Destination visit detail. Exactly one representative image: choosing a new
 * one replaces the old, and it can be removed again.
 */
export default function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const actions = useActions();
  const { db, currentUserId } = useData();
  const ownerId = getVisit(db, id)?.user_id;
  const scoped = useScopedDb(ownerId);
  const visit = getVisit(scoped, id);
  if (!visit) return <MissingItem what="destination" />;

  const isOwner = visit.user_id === currentUserId;
  const place = describeCity(scoped, visit.city_id);
  const trip = getTrip(scoped, visit.trip_id);
  const history = visitsForCity(scoped, visit.user_id, visit.city_id).filter((v) => v.id !== visit.id);

  const changeImage = async () => {
    try {
      const path = await pickRepresentativeImage();
      if (path) actions.setVisitImage(visit.id, path);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Could not use that image.');
    }
  };

  const remove = () =>
    confirmDestructive('Delete destination', `Delete this visit to ${place.cityName}?`, 'Delete', () => {
      actions.deleteVisit(visit.id);
      router.back();
    });

  return (
    <Screen bottomInset={48}>
      <ScreenHeader
        title={visit.name}
        subtitle={formatDateRange(visit.visit_date, visit.end_date ?? visit.visit_date)}
        back
        right={
          isOwner ? (
            <>
              <IconButton icon="create-outline" accessibilityLabel="Edit destination" filled onPress={() => router.push(`/form/visit?id=${visit.id}`)} />
              <IconButton icon="trash-outline" accessibilityLabel="Delete destination" filled color="#EF4444" onPress={remove} />
            </>
          ) : undefined
        }
      />

      <DestinationImage path={visit.image_path} size="medium" style={styles.image} />
      {isOwner ? (
        <View style={styles.imageActions}>
          <Button
            label={visit.image_path ? 'Replace image' : 'Add image'}
            variant="secondary"
            icon="image-outline"
            fullWidth={false}
            onPress={changeImage}
          />
          {visit.image_path ? (
            <Button label="Remove" variant="ghost" icon="close-circle-outline" fullWidth={false} onPress={() => actions.removeVisitImage(visit.id)} />
          ) : null}
        </View>
      ) : null}

      <View style={styles.meta}>
        <View style={styles.place}>
          <CountryFlag isoCode={place.isoCode} size={22} />
          <AppText variant="bodyLarge">{place.text}</AppText>
        </View>
        <VisibilityBadge visibility={visit.visibility} />
      </View>

      {trip ? (
        <Card onPress={() => router.push(`/trip/${trip.id}`)} style={{ marginTop: spacing.md }}>
          <AppText variant="small" tone="muted">
            Part of trip
          </AppText>
          <AppText variant="bodyLarge">{trip.title}</AppText>
        </Card>
      ) : null}

      {visit.notes ? (
        <AppText tone="secondary" style={{ marginTop: spacing.md }}>
          {visit.notes}
        </AppText>
      ) : null}

      {history.length > 0 ? (
        <View style={{ marginTop: spacing.lg }}>
          <SectionHeader
            title={`Other visits to ${place.cityName}`}
            actionLabel="All"
            onAction={() => router.push(`/city/${visit.city_id}?owner=${visit.user_id}`)}
          />
          <View style={{ gap: spacing.sm }}>
            {history.map((v) => (
              <VisitCard
                key={v.id}
                visit={v}
                subtitle={formatDateRange(v.visit_date, v.end_date ?? v.visit_date)}
                onPress={() => router.replace(`/visit/${v.id}`)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 240, borderRadius: radii.lg },
  imageActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  place: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
