import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon } from './Icon';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

/** Empty state, e.g. "Your world is waiting. [Add first trip]". */
export function EmptyState({ title, message, actionLabel, onAction, icon = 'earth' }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintBlue }]}>
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <AppText variant="title" style={styles.centerText}>
        {title}
      </AppText>
      {message ? (
        <AppText tone="secondary" style={styles.centerText}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} fullWidth={false} /> : null}
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Error state: "Something went wrong. [Try again]". */
export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintOrange }]}>
        <Icon name="alert-circle-outline" size={30} color={colors.danger} />
      </View>
      <AppText variant="title" style={styles.centerText}>
        {message}
      </AppText>
      {onRetry ? <Button label="Try again" onPress={onRetry} fullWidth={false} variant="secondary" /> : null}
    </View>
  );
}

interface SkeletonProps {
  height?: number;
  width?: number | `${number}%`;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsing placeholder used instead of blank screens while loading. */
export function Skeleton({ height = 16, width = '100%', radius = radii.md, style }: SkeletonProps) {
  const colors = useColors();
  const [opacity] = useState(() => new Animated.Value(0.45));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[{ height, width, borderRadius: radius, backgroundColor: colors.border, opacity }, style]}
    />
  );
}

/** A full-screen loading layout (header + cards). */
export function ScreenSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton height={28} width="55%" />
      <Skeleton height={90} />
      <Skeleton height={260} radius={radii.xl} />
      <Skeleton height={110} />
      <Skeleton height={110} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  centerText: { textAlign: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  skeleton: { gap: spacing.lg, padding: spacing.xl },
});
