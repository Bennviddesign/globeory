import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatsRow } from '@/components/cards/StatCard';
import { TripCard } from '@/components/cards/TripCard';
import { AppText } from '@/components/common/AppText';
import { Avatar } from '@/components/common/Avatar';
import { Card } from '@/components/common/Card';
import { IconButton } from '@/components/common/IconButton';
import { Screen } from '@/components/common/Screen';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/StateViews';
import { GlobeSection } from '@/components/globe/GlobeSection';
import { PAGE_PADDING, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useSettings } from '@/context/SettingsContext';
import { useScopedDb, useStats } from '@/context/useTravelData';
import { unreadCount } from '@/services/social/notificationService';
import { buildGlobalTimeline } from '@/services/timeline/globalTimeline';

/** Home / Explore (spec section 7): greeting, stats, globe preview, recent trips. */
export default function ExploreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { db, currentUser, currentUserId } = useData();
  const { notifications } = useSettings();
  const scoped = useScopedDb(currentUserId);
  const stats = useStats(currentUserId);

  const unread = useMemo(
    () => (currentUserId ? unreadCount(db, currentUserId, notifications) : 0),
    [db, currentUserId, notifications],
  );
  const recentTrips = useMemo(
    () =>
      currentUserId
        ? buildGlobalTimeline(scoped, currentUserId)
            .flatMap((y) => y.items)
            .slice(0, 3)
        : [],
    [scoped, currentUserId],
  );

  const isEmpty = stats.visits === 0 && stats.trips === 0 && stats.flights === 0;
  const globeWidth = Math.min(width - PAGE_PADDING * 2, 420);

  return (
    <Screen bottomInset={48}>
      <View style={styles.header}>
        <Avatar name={currentUser?.display_name ?? '?'} uri={currentUser?.avatar_url} size={44} />
        <View style={{ flex: 1 }}>
          <AppText variant="small" tone="muted">
            Welcome back
          </AppText>
          <AppText variant="headline" numberOfLines={1}>
            {currentUser?.display_name ?? 'Traveler'}
          </AppText>
        </View>
        <IconButton icon="search" accessibilityLabel="Search travelers" onPress={() => router.push('/search')} filled />
        <IconButton
          icon="notifications-outline"
          accessibilityLabel={unread ? `Notifications, ${unread} unread` : 'Notifications'}
          badge={unread > 0}
          onPress={() => router.push('/notifications')}
          filled
        />
      </View>

      {isEmpty ? (
        <EmptyState
          title="Your world is waiting"
          message="Add your first trip and watch your globe come alive."
          actionLabel="Add first trip"
          onAction={() => router.push('/form/trip')}
        />
      ) : (
        <View style={styles.content}>
          <StatsRow
            countries={stats.countries}
            cities={stats.cities}
            flights={stats.flights}
            hotels={stats.hotels}
            onPressItem={(key) =>
              router.push({ pathname: '/places', params: { tab: key === 'flights' ? 'airports' : key } })
            }
          />

          <Card padded={false} style={styles.globeCard}>
            <SectionHeader title="My World" actionLabel="Open" onAction={() => router.push('/globe')} />
            <GlobeSection
              ownerId={currentUserId ?? ''}
              width={globeWidth - spacing.lg}
              showFilters={false}
              showToggle={false}
              interactive={false}
            />
          </Card>

          <View>
            <SectionHeader title="Recent trips" actionLabel="See all" onAction={() => router.push('/trips')} />
            <View style={{ gap: spacing.sm }}>
              {recentTrips.map((item) =>
                item.kind === 'trip' ? (
                  <TripCard
                    key={item.key}
                    trip={item.trip}
                    coverImage={item.coverImage}
                    countries={item.countries}
                    onPress={() => router.push(`/trip/${item.trip.id}`)}
                  />
                ) : null,
              )}
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  content: { gap: spacing.xl },
  globeCard: { padding: spacing.md, alignItems: 'center' },
});
