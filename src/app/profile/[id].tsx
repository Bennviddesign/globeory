import { useLocalSearchParams } from 'expo-router';
import { ProfileView } from '@/components/profile/ProfileView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { getUser } from '@/services/data/lookup';
import { useData } from '@/context/DataContext';

/** Another traveler's profile (privacy rules are applied inside ProfileView). */
export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useData();
  const user = getUser(db, id);
  return (
    <Screen bottomInset={48}>
      <ScreenHeader title={user ? `@${user.username}` : 'Profile'} back />
      <ProfileView userId={id} />
    </Screen>
  );
}
