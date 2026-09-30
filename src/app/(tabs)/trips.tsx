import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { GlobalTimelineList } from '@/components/timeline/GlobalTimelineList';
import { EmptyState } from '@/components/common/StateViews';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { IconButton } from '@/components/common/IconButton';
import { useData } from '@/context/DataContext';
import { useScopedDb } from '@/context/useTravelData';
import { buildGlobalTimeline, type TimelineItem } from '@/services/timeline/globalTimeline';

/** Global timeline (spec section 10): every trip and standalone visit by year. */
export default function TripsScreen() {
  const router = useRouter();
  const { currentUserId } = useData();
  const scoped = useScopedDb(currentUserId);
  const years = useMemo(
    () => (currentUserId ? buildGlobalTimeline(scoped, currentUserId) : []),
    [scoped, currentUserId],
  );

  const open = (item: TimelineItem) =>
    router.push(item.kind === 'trip' ? `/trip/${item.trip.id}` : `/visit/${item.visit.id}`);

  return (
    <Screen bottomInset={48}>
      <ScreenHeader
        title="Trips"
        subtitle="Your travel timeline"
        right={<IconButton icon="add" accessibilityLabel="Add trip" filled onPress={() => router.push('/form/trip')} />}
      />
      {years.length === 0 ? (
        <EmptyState
          title="No trips yet"
          message="Your timeline starts with your first trip."
          actionLabel="Add first trip"
          onAction={() => router.push('/form/trip')}
        />
      ) : (
        <GlobalTimelineList years={years} onOpen={open} showVisibility />
      )}
    </Screen>
  );
}
