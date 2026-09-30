import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { DestinationResultCard, UserResultCard } from '@/components/cards/PersonCards';
import { Button } from '@/components/common/Button';
import { FilterChip } from '@/components/common/FilterChip';
import { Icon } from '@/components/common/Icon';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { EmptyState } from '@/components/common/StateViews';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useColors } from '@/context/ThemeContext';
import { useActions } from '@/context/useActions';
import { DESTINATION_SORTS, searchDestinations, type DestinationSort } from '@/services/search/destinationSearch';
import { searchUsers } from '@/services/search/userSearch';

type Mode = 'users' | 'destinations';

/**
 * Discovery: search by username or by destination (spec sections 29-32).
 * Destination search only returns people who recorded a real visit there.
 */
export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const actions = useActions();
  const { db, currentUserId } = useData();
  const [mode, setMode] = useState<Mode>('users');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [sort, setSort] = useState<DestinationSort>('relevance');
  // The page resets automatically whenever the query, sort or mode changes.
  const searchKey = `${mode}|${debounced}|${sort}`;
  const [pageState, setPageState] = useState({ key: searchKey, page: 0 });
  const page = pageState.key === searchKey ? pageState.page : 0;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const users = useMemo(
    () => (mode === 'users' ? searchUsers(db, currentUserId, debounced) : []),
    [db, currentUserId, debounced, mode],
  );
  // Results are cumulative: page N contains the first (N + 1) pages.
  const destinations = useMemo(
    () => (mode === 'destinations' ? searchDestinations(db, currentUserId, debounced, sort, page) : null),
    [db, currentUserId, debounced, sort, page, mode],
  );

  const toggleFollow = (userId: string, following: boolean) =>
    following ? actions.unfollow(userId) : actions.follow(userId);

  const hasQuery = debounced.trim().length > 0;

  return (
    <Screen edges={['top', 'bottom']} bottomInset={48}>
      <ScreenHeader title="Search" back />
      <SegmentedControl
        options={[
          { value: 'users', label: 'People', icon: 'person' },
          { value: 'destinations', label: 'Destinations', icon: 'location' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={mode === 'users' ? 'Search username or name' : 'Search a city, e.g. Tokyo'}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search"
          style={[styles.input, { color: colors.text }]}
        />
      </View>

      {mode === 'destinations' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sorts}>
          {DESTINATION_SORTS.map((s) => (
            <FilterChip key={s.key} label={s.label} selected={sort === s.key} onPress={() => setSort(s.key)} />
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.results}>
        {!hasQuery ? (
          <EmptyState
            title={mode === 'users' ? 'Find travelers' : 'Who has been there?'}
            message={
              mode === 'users'
                ? 'Search by username or name.'
                : 'Search a destination to find people who really visited it.'
            }
            icon="search-outline"
          />
        ) : mode === 'users' ? (
          users.length === 0 ? (
            <EmptyState title="No travelers found" message="Check the spelling and try again." icon="person-outline" />
          ) : (
            users.map((r) => (
              <UserResultCard
                key={r.user.id}
                result={r}
                onOpen={() => router.push(`/profile/${r.user.id}`)}
                onToggleFollow={() => toggleFollow(r.user.id, r.isFollowing)}
              />
            ))
          )
        ) : destinations && destinations.results.length === 0 ? (
          <EmptyState title="No travelers found" message="Nobody has shared a visit there yet." icon="location-outline" />
        ) : (
          <>
            {destinations?.results.map((r) => (
              <DestinationResultCard
                key={`${r.user.id}-${r.city.id}`}
                result={r}
                onOpen={() => router.push(`/profile/${r.user.id}`)}
                onToggleFollow={() => toggleFollow(r.user.id, r.isFollowing)}
              />
            ))}
            {destinations?.hasMore ? (
              <Button label="Load more" variant="secondary" onPress={() => setPageState({ key: searchKey, page: page + 1 })} />
            ) : null}
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: MIN_TOUCH + 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  input: { flex: 1, fontSize: 16, minHeight: MIN_TOUCH },
  sorts: { gap: spacing.sm, paddingVertical: spacing.md },
  results: { gap: spacing.sm, marginTop: spacing.md },
});
