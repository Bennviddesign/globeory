import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Show a back button (stack screens). */
  back?: boolean;
  /** Close icon instead of back arrow (modal-like screens). */
  close?: boolean;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, back = false, close = false, right }: ScreenHeaderProps) {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={styles.row}>
      {back || close ? (
        <IconButton
          icon={close ? 'close' : 'chevron-back'}
          accessibilityLabel={close ? 'Close' : 'Go back'}
          onPress={goBack}
          filled
        />
      ) : null}
      <View style={styles.titles}>
        <AppText variant="headline" numberOfLines={1} accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  titles: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
