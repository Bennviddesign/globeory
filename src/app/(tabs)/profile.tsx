import { useRouter } from 'expo-router';
import { ProfileView } from '@/components/profile/ProfileView';
import { IconButton } from '@/components/common/IconButton';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useData } from '@/context/DataContext';

/** Own profile: same ProfileView as other users, plus Settings and Edit. */
export default function ProfileTab() {
  const router = useRouter();
  const { currentUserId } = useData();
  return (
    <Screen bottomInset={48}>
      <ScreenHeader
        title="Profile"
        right={<IconButton icon="settings-outline" accessibilityLabel="Settings" filled onPress={() => router.push('/settings')} />}
      />
      {currentUserId ? <ProfileView userId={currentUserId} /> : null}
    </Screen>
  );
}
