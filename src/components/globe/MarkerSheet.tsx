import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { CATEGORY_ICONS } from '@/constants/categories';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { useScopedDb, useUnit } from '@/context/useTravelData';
import type { ID } from '@/models/common';
import { getVisit } from '@/services/data/lookup';
import { formatDistance } from '@/services/geo/distance';
import type { GlobeMarker } from '@/services/globe/globeData';
import { formatDateRange } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { DestinationImage } from '../common/DestinationImage';
import { Icon } from '../common/Icon';
import { BottomSheet } from '../modals/BottomSheet';

interface MarkerSheetProps {
  markers: GlobeMarker[] | null;
  ownerId: ID;
  onClose: () => void;
}

/** Bottom sheet opened by tapping a marker (spec section 7). Lists what is behind the marker(s). */
export function MarkerSheet({ markers, ownerId, onClose }: MarkerSheetProps) {
  const router = useRouter();
  const colors = useColors();
  const unit = useUnit();
  const scoped = useScopedDb(ownerId);
  const single = markers && markers.length === 1 ? markers[0] : null;

  const open = (href: string) => {
    onClose();
    router.push(href as never);
  };

  const flightsAtAirport = (airportId: ID) =>
    scoped.flights.filter((f) => f.departure_airport_id === airportId || f.arrival_airport_id === airportId);

  return (
    <BottomSheet
      visible={Boolean(markers)}
      onClose={onClose}
      title={single ? single.title : `${markers?.length ?? 0} places here`}
    >
      <View style={styles.list}>
        {(markers ?? []).map((marker) => (
          <View key={marker.id} style={[styles.block, { backgroundColor: colors.surfaceMuted }]}>
            <Pressable
              style={styles.header}
              accessibilityRole="button"
              accessibilityLabel={`${marker.title}. ${marker.subtitle}`}
              onPress={
                marker.refType === 'city'
                  ? () => open(`/city/${marker.refId}?owner=${ownerId}`)
                  : undefined
              }
            >
              <View style={[styles.dot, { backgroundColor: colors.category[marker.category] + '22' }]}>
                <Icon name={CATEGORY_ICONS[marker.category]} size={18} color={colors.category[marker.category]} />
              </View>
              <View style={{ flex: 1 }}>
                {!single ? <AppText variant="bodyLarge">{marker.title}</AppText> : null}
                <AppText variant="small" tone="muted">
                  {marker.subtitle}
                </AppText>
              </View>
              {marker.refType === 'city' ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
            </Pressable>

            {marker.refType === 'city'
              ? marker.visitIds.map((visitId) => {
                  const visit = getVisit(scoped, visitId);
                  if (!visit) return null;
                  return (
                    <Pressable
                      key={visitId}
                      onPress={() => open(`/visit/${visit.id}`)}
                      accessibilityRole="button"
                      accessibilityLabel={`${visit.name}, ${formatDateRange(visit.visit_date, visit.end_date ?? visit.visit_date)}`}
                      style={styles.visitRow}
                    >
                      <DestinationImage path={visit.image_path} style={styles.thumb} />
                      <View style={{ flex: 1 }}>
                        <AppText variant="label">{formatDateRange(visit.visit_date, visit.end_date ?? visit.visit_date)}</AppText>
                        {visit.notes ? (
                          <AppText variant="small" tone="muted" numberOfLines={1}>
                            {visit.notes}
                          </AppText>
                        ) : null}
                      </View>
                      <Icon name="chevron-forward" size={16} color={colors.textMuted} />
                    </Pressable>
                  );
                })
              : null}

            {marker.refType === 'airport'
              ? flightsAtAirport(marker.refId).map((flight) => (
                  <Pressable
                    key={flight.id}
                    onPress={() => open(`/flight/${flight.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`Flight ${flight.flight_number ?? ''}`}
                    style={styles.visitRow}
                  >
                    <Icon name="airplane" size={18} color={colors.category.flight} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="label">{flight.flight_number ?? 'Flight'}</AppText>
                      <AppText variant="small" tone="muted">
                        {formatDistance(flight.distance_km, unit)}
                      </AppText>
                    </View>
                    <Icon name="chevron-forward" size={16} color={colors.textMuted} />
                  </Pressable>
                ))
              : null}
          </View>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingBottom: spacing.md },
  block: { borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH },
  dot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH },
  thumb: { width: 48, height: 48, borderRadius: radii.md },
});
