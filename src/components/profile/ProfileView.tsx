import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PAGE_PADDING, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useActions } from '@/context/useActions';
import { useScopedDb, useStats } from '@/context/useTravelData';
import type { ID } from '@/models/common';
import { followerCount, followingCount, isFollowing } from '@/services/social/followService';
import { canViewProfileContent } from '@/services/social/visibilityService';
import { getUser } from '@/services/data/lookup';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { EmptyState } from '../common/StateViews';
import { StatsRow } from '../cards/StatCard';
import { GlobeSection } from '../globe/GlobeSection';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs } from './ProfileTabs';

/**
 * A traveler's profile: header, statistics, globe preview and Trips / Places /
 * Memories. Used for the own Profile tab and for other users' public profiles;
 * everything is filtered by the viewer's permissions.
 */
export function ProfileView({ userId }: { userId: ID }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { db, currentUserId } = useData();
  const actions = useActions();
  const scoped = useScopedDb(userId);
  const stats = useStats(userId);

  const user = getUser(db, userId);
  const isSelf = userId === currentUserId;
  const following = currentUserId ? isFollowing(db, currentUserId, userId) : false;
  const allowed = canViewProfileContent(db, currentUserId, userId);

  const heroImage = useMemo(
    () =>
      [...scoped.destination_visits]
        .filter((v) => v.image_path)
        .sort((a, b) => b.visit_date.localeCompare(a.visit_date))[0]?.image_path ?? null,
    [scoped],
  );

  if (!user) return <EmptyState title="Profile not found" icon="person-outline" />;
  const globeSize = Math.min(width - PAGE_PADDING * 2, 360);

  return (
    <View style={styles.container}>
      <ProfileHeader
        user={user}
        heroImage={allowed ? heroImage : null}
        isSelf={isSelf}
        isFollowing={following}
        followers={followerCount(db, userId)}
        following={followingCount(db, userId)}
        onEdit={() => router.push('/edit-profile')}
        onToggleFollow={() => (following ? actions.unfollow(userId) : actions.follow(userId))}
      />

      {allowed ? (
        <>
          <StatsRow countries={stats.countries} cities={stats.cities} flights={stats.flights} hotels={stats.hotels} />
          <Pressable
            onPress={() => router.push(`/globe?owner=${userId}`)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${user.display_name}'s globe`}
          >
            <Card padded={false} style={styles.globeCard}>
              <GlobeSection ownerId={userId} width={globeSize} showToggle={false} showFilters={false} interactive={false} />
              <View style={styles.openRow}>
                <AppText variant="label" tone="primary">
                  Explore full globe
                </AppText>
                <Icon name="arrow-forward" size={14} color="#3B82F6" />
              </View>
            </Card>
          </Pressable>
          <ProfileTabs ownerId={userId} isSelf={isSelf} />
        </>
      ) : (
        <EmptyState
          icon="lock-closed-outline"
          title="This profile is private"
          message={`Follow ${user.display_name} to see their globe and travel history.`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  globeCard: { alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
});
