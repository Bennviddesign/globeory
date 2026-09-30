import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { NotificationRow } from '@/components/cards/NotificationRow';
import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { EmptyState } from '@/components/common/StateViews';
import { spacing } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useSettings } from '@/context/SettingsContext';
import { useActions } from '@/context/useActions';
import { getUser } from '@/services/data/lookup';
import { describeNotification, listNotifications } from '@/services/social/notificationService';

/** Notifications (spec section 34): tapping one opens the trip / destination / profile. */
export default function NotificationsScreen() {
  const router = useRouter();
  const actions = useActions();
  const { db, currentUserId } = useData();
  const { notifications: preferences } = useSettings();

  const items = useMemo(
    () =>
      currentUserId
        ? listNotifications(db, currentUserId, preferences).map((n) => describeNotification(db, n))
        : [],
    [db, currentUserId, preferences],
  );
  const hasUnread = items.some((n) => !n.isRead);

  return (
    <Screen bottomInset={48}>
      <ScreenHeader title="Notifications" back />
      {items.length === 0 ? (
        <EmptyState title="All caught up" message="You will see new trips and destinations from people you follow here." icon="notifications-outline" />
      ) : (
        <View style={{ gap: spacing.sm }}>
          {hasUnread ? <Button label="Mark all as read" variant="ghost" icon="checkmark-done" fullWidth={false} onPress={actions.markAllNotificationsRead} /> : null}
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              avatarUri={getUser(db, n.actorId)?.avatar_url}
              onPress={() => {
                actions.markNotificationRead(n.id);
                router.push(n.href as never);
              }}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
