import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/common/AppText';
import { Avatar } from '@/components/common/Avatar';
import { IconButton } from '@/components/common/IconButton';
import { EmptyState } from '@/components/common/StateViews';
import { FeedCard } from '@/components/feed/FeedCard';
import { FeedFilters } from '@/components/feed/FeedFilters';
import { PAGE_PADDING, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useSettings } from '@/context/SettingsContext';
import { useColors } from '@/context/ThemeContext';
import { useFeed } from '@/context/useFeed';
import type { FeedCard as FeedCardData } from '@/services/feed/feedTypes';
import { unreadCount } from '@/services/social/notificationService';

const keyExtractor = (card: FeedCardData) => card.key;

/** Explore: a calm feed of travelers (mini globe + stats), filterable by city / country / airport. */
export default function ExploreScreen() {
  const router = useRouter();
  const colors = useColors();
  const { width } = useWindowDimensions();
  const { db, currentUser, currentUserId } = useData();
  const { notifications } = useSettings();
  const { cards, filter, setScope, setSort } = useFeed();

  const unread = useMemo(
    () => (currentUserId ? unreadCount(db, currentUserId, notifications) : 0),
    [db, currentUserId, notifications],
  );
  // Card padding is spacing.lg on each side (see Card).
  const globeSize = Math.min(width - PAGE_PADDING * 2 - spacing.lg * 2, 340);

  const renderItem = useCallback(
    ({ item }: { item: FeedCardData }) => <FeedCard card={item} globeSize={globeSize} />,
    [globeSize],
  );

  const header = (
    <View>
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
      <FeedFilters filter={filter} onScopeChange={setScope} onSortChange={setSort} />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={cards}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            title="Nothing to explore yet"
            message="Travelers who share their world will show up here."
            icon="earth-outline"
          />
        }
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const Separator = () => <View style={{ height: spacing.md }} />;

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  content: { paddingHorizontal: PAGE_PADDING, paddingBottom: 48 },
});
