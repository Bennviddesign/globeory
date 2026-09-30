import { useRouter } from 'expo-router';
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MIN_TOUCH, spacing } from '@/constants/layout';
import type { FeedCard as FeedCardData } from '@/services/feed/feedTypes';
import { AppText } from '../common/AppText';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';
import { FeedGlobe } from './FeedGlobe';
import { FeedStats } from './FeedStats';

interface FeedCardProps {
  card: FeedCardData;
  globeSize: number;
}

/** Header (avatar + @username, opens the profile), mini globe and stats. No social counters. */
export const FeedCard = memo(function FeedCard({ card, globeSize }: FeedCardProps) {
  const router = useRouter();
  const { user, highlight } = card;
  const center = useMemo<readonly [number, number]>(
    () => [highlight.longitude, highlight.latitude],
    [highlight.longitude, highlight.latitude],
  );

  return (
    <Card style={styles.card}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Open profile of ${user.display_name}`}
        onPress={() => router.push(`/profile/${user.id}`)}
        style={styles.header}
      >
        <Avatar name={user.display_name} uri={user.avatar_url} size={40} />
        <View style={styles.names}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {user.display_name}
          </AppText>
          <AppText variant="small" tone="primary" numberOfLines={1}>
            @{user.username}
          </AppText>
        </View>
      </Pressable>
      <FeedGlobe data={card.globe} size={globeSize} center={center} />
      <FeedStats stats={card.stats} highlight={highlight} />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH },
  names: { flex: 1 },
});
