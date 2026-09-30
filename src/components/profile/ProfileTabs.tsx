import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { useScopedDb } from '@/context/useTravelData';
import type { ID } from '@/models/common';
import { aggregateCities } from '@/services/stats/placeStats';
import { buildGlobalTimeline } from '@/services/timeline/globalTimeline';
import { AppText } from '../common/AppText';
import { SegmentedControl } from '../common/SegmentedControl';
import { EmptyState } from '../common/StateViews';
import { CityRow } from '../cards/PlaceAggregateRows';
import { MemoryRow } from '../cards/MemoryRow';
import { GlobalTimelineList } from '../timeline/GlobalTimelineList';

type ProfileTab = 'trips' | 'places' | 'memories';

/** Trips | Places | Memories - only content the viewer may see (spec section 25). */
export function ProfileTabs({ ownerId, isSelf }: { ownerId: ID; isSelf: boolean }) {
  const router = useRouter();
  const scoped = useScopedDb(ownerId);
  const [tab, setTab] = useState<ProfileTab>('trips');

  const years = useMemo(() => buildGlobalTimeline(scoped, ownerId), [scoped, ownerId]);
  const cities = useMemo(() => aggregateCities(scoped, ownerId), [scoped, ownerId]);
  const memories = useMemo(
    () => scoped.memories.filter((m) => m.user_id === ownerId).sort((a, b) => b.date.localeCompare(a.date)),
    [scoped, ownerId],
  );

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={[
          { value: 'trips', label: 'Trips' },
          { value: 'places', label: 'Places' },
          { value: 'memories', label: 'Memories' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'trips' ? (
        years.length === 0 ? (
          <EmptyState title="No trips to show yet" icon="briefcase-outline" />
        ) : (
          <GlobalTimelineList
            years={years}
            showVisibility={isSelf}
            onOpen={(item) => router.push(item.kind === 'trip' ? `/trip/${item.trip.id}` : (`/visit/${item.visit.id}` as never))}
          />
        )
      ) : null}

      {tab === 'places' ? (
        cities.length === 0 ? (
          <EmptyState title="No places to show yet" icon="location-outline" />
        ) : (
          <View style={styles.list}>
            {cities.map((aggregate) => (
              <CityRow
                key={aggregate.city.id}
                aggregate={aggregate}
                onPress={() => router.push(`/city/${aggregate.city.id}?owner=${ownerId}`)}
              />
            ))}
          </View>
        )
      ) : null}

      {tab === 'memories' ? (
        memories.length === 0 ? (
          <EmptyState title="No memories to show yet" icon="heart-outline" />
        ) : (
          <View style={styles.list}>
            {memories.map((memory) => (
              <MemoryRow
                key={memory.id}
                db={scoped}
                memory={memory}
                onPress={isSelf ? () => router.push(`/form/memory?id=${memory.id}`) : undefined}
              />
            ))}
          </View>
        )
      ) : null}
      <AppText variant="caption" tone="muted" style={{ textAlign: 'center' }}>
        {isSelf ? 'You see everything, including private entries.' : 'Only content shared with you is shown.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, marginTop: spacing.xl },
  list: { gap: spacing.md },
});
