import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { DestinationResult } from '@/services/search/destinationSearch';
import type { UserSearchResult } from '@/services/search/userSearch';
import { timeAgo } from '@/services/util/dates';
import { flagEmoji } from '@/services/util/text';
import { AppText } from '../common/AppText';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface CommonProps {
  onOpen: () => void;
  onToggleFollow: () => void;
}

function FollowButton({ following, onPress, self }: { following: boolean; onPress: () => void; self: boolean }) {
  if (self) return null;
  return (
    <Button
      label={following ? 'Following' : 'Follow'}
      variant={following ? 'secondary' : 'primary'}
      onPress={onPress}
      fullWidth={false}
      style={styles.follow}
    />
  );
}

/** Username search result (spec section 29). */
export function UserResultCard({ result, onOpen, onToggleFollow }: CommonProps & { result: UserSearchResult }) {
  const { user } = result;
  const isPrivate = user.profile_visibility === 'private';
  return (
    <Card onPress={onOpen} accessibilityLabel={`${user.display_name}, @${user.username}`}>
      <View style={styles.row}>
        <Avatar name={user.display_name} uri={user.avatar_url} size={52} />
        <View style={styles.texts}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {user.display_name}
          </AppText>
          <AppText variant="small" tone="muted">
            @{user.username}
          </AppText>
          {isPrivate ? (
            <View style={styles.privateRow}>
              <Icon name="lock-closed-outline" size={12} color="#94A3B8" />
              <AppText variant="caption" tone="muted">
                Private profile
              </AppText>
            </View>
          ) : (
            <AppText variant="small" tone="secondary">
              {result.countries} countries · {result.cities} cities
            </AppText>
          )}
        </View>
        <FollowButton following={result.isFollowing} onPress={onToggleFollow} self={result.isSelf} />
      </View>
    </Card>
  );
}

/**
 * Destination search result (spec section 30). It says clearly that the person
 * appears because they RECORDED this destination, not because of their bio.
 */
export function DestinationResultCard({ result, onOpen, onToggleFollow }: CommonProps & { result: DestinationResult }) {
  const colors = useColors();
  const { user, city, country } = result;
  const flag = country ? flagEmoji(country.iso_code) : '';
  const visits = result.matchingVisits > 1 ? ` · ${result.matchingVisits} visits` : '';
  return (
    <Card onPress={onOpen} accessibilityLabel={`${user.display_name} recorded ${city.name}`}>
      <View style={styles.row}>
        <Avatar name={user.display_name} uri={user.avatar_url} size={52} />
        <View style={styles.texts}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {user.display_name}
          </AppText>
          <AppText variant="small" tone="muted">
            @{user.username}
          </AppText>
          <View style={[styles.recorded, { backgroundColor: colors.tintBlue }]}>
            <Icon name="location" size={12} color={colors.primary} />
            <AppText variant="caption" tone="primary" numberOfLines={1}>
              {flag} {city.name} · Added {timeAgo(result.lastAddedAt)}
              {visits}
            </AppText>
          </View>
          <AppText variant="small" tone="secondary">
            {result.countries} countries · {result.cities} cities · {result.followers}{' '}
            {result.followers === 1 ? 'follower' : 'followers'}
          </AppText>
        </View>
        <FollowButton following={result.isFollowing} onPress={onToggleFollow} self={result.isSelf} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texts: { flex: 1, gap: 2 },
  privateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recorded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    marginVertical: 2,
    maxWidth: '100%',
  },
  follow: { minHeight: 40, paddingHorizontal: spacing.lg },
});
