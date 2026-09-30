import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { NotificationView } from '@/services/social/notificationService';
import { timeAgo } from '@/services/util/dates';
import { AppText } from '../common/AppText';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';

interface NotificationRowProps {
  notification: NotificationView;
  avatarUri?: string | null;
  onPress: () => void;
}

export function NotificationRow({ notification, avatarUri, onPress }: NotificationRowProps) {
  const colors = useColors();
  return (
    <Card onPress={onPress} accessibilityLabel={`${notification.message}. ${timeAgo(notification.createdAt)}`}>
      <View style={styles.row}>
        <Avatar name={notification.actorName} uri={avatarUri} size={44} />
        <View style={styles.texts}>
          <AppText variant="body" style={{ fontWeight: notification.isRead ? '400' : '600' }}>
            {notification.message}
          </AppText>
          <AppText variant="caption" tone="muted">
            {timeAgo(notification.createdAt)}
          </AppText>
        </View>
        {!notification.isRead ? <View style={[styles.unread, { backgroundColor: colors.primary }]} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texts: { flex: 1, gap: 2 },
  unread: { width: 10, height: 10, borderRadius: 5 },
});
