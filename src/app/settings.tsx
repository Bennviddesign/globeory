import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { ListRow } from '@/components/common/ListRow';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { confirmDestructive } from '@/components/modals/confirm';
import { APP_NAME } from '@/constants/app';
import { spacing } from '@/constants/layout';
import type { ThemeMode } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { useSettings } from '@/context/SettingsContext';
import { useColors } from '@/context/ThemeContext';
import { useActions } from '@/context/useActions';
import type { NotificationPreferences } from '@/models/social';

const NOTIFICATION_ROWS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: 'trips', label: 'New trips' },
  { key: 'destinations', label: 'New destinations' },
  { key: 'memories', label: 'New memories' },
  { key: 'activities', label: 'New activities' },
  { key: 'followers', label: 'New followers' },
];

/** Settings (spec section 35): theme, units, privacy, notifications, demo / account. */
export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const actions = useActions();
  const { currentUser, resetDemoData } = useData();
  const { themeMode, setThemeMode, notifications, setNotificationPreference } = useSettings();
  const { isDemo, signOut, deleteLocalData } = useSession();

  const leave = () => {
    signOut();
    router.replace('/onboarding');
  };

  return (
    <Screen bottomInset={48}>
      <ScreenHeader title="Settings" back />

      <Group title="Appearance">
        <SegmentedControl<ThemeMode>
          options={[
            { value: 'light', label: 'Light', icon: 'sunny' },
            { value: 'dark', label: 'Dark', icon: 'moon' },
            { value: 'system', label: 'System', icon: 'phone-portrait' },
          ]}
          value={themeMode}
          onChange={setThemeMode}
        />
      </Group>

      <Group title="Distance unit">
        <SegmentedControl
          options={[
            { value: 'km', label: 'Kilometers' },
            { value: 'mi', label: 'Miles' },
          ]}
          value={currentUser?.preferred_unit ?? 'km'}
          onChange={actions.setPreferredUnit}
        />
      </Group>

      <Group title="Privacy">
        <SegmentedControl
          options={[
            { value: 'public', label: 'Public profile' },
            { value: 'private', label: 'Private profile' },
          ]}
          value={currentUser?.profile_visibility ?? 'public'}
          onChange={actions.setProfileVisibility}
        />
        <AppText variant="small" tone="muted" style={styles.hint}>
          {currentUser?.profile_visibility === 'private'
            ? 'Only your followers can see your travels. You will not appear in destination search.'
            : 'Anyone can see the content you mark as public.'}
        </AppText>
      </Group>

      <Group title="Notifications">
        <Card padded={false}>
          <View style={{ paddingHorizontal: spacing.md }}>
            {NOTIFICATION_ROWS.map((row) => (
              <ListRow
                key={row.key}
                title={row.label}
                right={
                  <Switch
                    accessibilityLabel={row.label}
                    value={notifications[row.key]}
                    onValueChange={(v) => setNotificationPreference(row.key, v)}
                    trackColor={{ true: colors.primary, false: colors.border }}
                  />
                }
              />
            ))}
          </View>
        </Card>
      </Group>

      <Group title="Account">
        <Card padded={false}>
          <View style={{ paddingHorizontal: spacing.md }}>
            <ListRow title="Edit profile" icon="person-outline" chevron onPress={() => router.push('/edit-profile')} />
            {isDemo ? (
              <ListRow
                title="Reset demo data"
                subtitle="Restore the original sample data"
                icon="refresh-outline"
                onPress={() =>
                  confirmDestructive('Reset demo data', 'All changes you made in Demo Mode will be lost.', 'Reset', resetDemoData)
                }
              />
            ) : null}
            <ListRow title={isDemo ? 'Exit demo' : 'Sign out'} icon="log-out-outline" onPress={leave} />
            {!isDemo ? (
              <ListRow
                title="Delete all my data"
                subtitle="Removes everything stored on this device"
                icon="trash-outline"
                destructive
                onPress={() =>
                  Alert.alert('Delete all data', 'This permanently deletes your profile, trips and images from this device.', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        void deleteLocalData().then(() => router.replace('/onboarding'));
                      },
                    },
                  ])
                }
              />
            ) : null}
          </View>
        </Card>
      </Group>

      <AppText variant="caption" tone="muted" style={styles.footer}>
        {APP_NAME} · {isDemo ? 'Demo Mode (local sample data)' : 'Local profile (stored on this device)'}
      </AppText>
    </Screen>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <AppText variant="label" tone="muted" style={styles.groupTitle}>
        {title.toUpperCase()}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginTop: spacing.lg },
  groupTitle: { marginBottom: spacing.sm, letterSpacing: 1 },
  hint: { marginTop: spacing.sm },
  footer: { textAlign: 'center', marginTop: spacing.xl },
});
