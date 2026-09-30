import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { User } from '@/models/user';
import { AppText } from '../common/AppText';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { DestinationImage } from '../common/DestinationImage';
import { Icon } from '../common/Icon';

interface ProfileHeaderProps {
  user: User;
  heroImage: string | null;
  isSelf: boolean;
  isFollowing: boolean;
  followers: number;
  following: number;
  onEdit: () => void;
  onToggleFollow: () => void;
}

/** Hero image, overlapping avatar, name, handle, location, bio and follow / edit action. */
export function ProfileHeader({
  user,
  heroImage,
  isSelf,
  isFollowing,
  followers,
  following,
  onEdit,
  onToggleFollow,
}: ProfileHeaderProps) {
  const colors = useColors();
  const location = [user.home_city, user.home_country].filter(Boolean).join(', ');

  return (
    <View>
      <View style={styles.hero}>
        <DestinationImage path={heroImage} size="medium" style={StyleSheet.absoluteFill} placeholderIcon="earth" />
        <LinearGradient colors={['transparent', colors.background]} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.body}>
        <View style={styles.avatarRow}>
          <Avatar name={user.display_name} uri={user.avatar_url} size={92} ring />
          <View style={styles.action}>
            {isSelf ? (
              <Button label="Edit profile" variant="secondary" icon="create-outline" onPress={onEdit} fullWidth={false} />
            ) : (
              <Button
                label={isFollowing ? 'Following' : 'Follow'}
                variant={isFollowing ? 'secondary' : 'primary'}
                icon={isFollowing ? 'checkmark' : 'person-add-outline'}
                onPress={onToggleFollow}
                fullWidth={false}
              />
            )}
          </View>
        </View>

        <AppText variant="headline" accessibilityRole="header">
          {user.display_name}
        </AppText>
        <View style={styles.meta}>
          <AppText tone="muted">@{user.username}</AppText>
          {user.profile_visibility === 'private' ? (
            <View style={styles.privacy}>
              <Icon name="lock-closed-outline" size={12} color={colors.textMuted} />
              <AppText variant="caption" tone="muted">
                Private
              </AppText>
            </View>
          ) : null}
        </View>
        {location ? (
          <View style={styles.meta}>
            <Icon name="location-outline" size={14} color={colors.textMuted} />
            <AppText variant="small" tone="secondary">
              {location}
            </AppText>
          </View>
        ) : null}
        {user.bio ? <AppText style={{ marginTop: spacing.sm }}>{user.bio}</AppText> : null}

        <View style={styles.follows}>
          <AppText variant="label">
            {followers} <AppText variant="small" tone="muted">followers</AppText>
          </AppText>
          <AppText variant="label">
            {following} <AppText variant="small" tone="muted">following</AppText>
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 170, borderRadius: radii.xl, overflow: 'hidden' },
  body: { marginTop: -46, gap: 2 },
  avatarRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.sm },
  action: { paddingBottom: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: spacing.sm },
  follows: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
});
