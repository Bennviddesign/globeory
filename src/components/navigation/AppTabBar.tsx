import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MIN_TOUCH, TAB_BAR_HEIGHT, spacing } from '@/constants/layout';
import { useTheme } from '@/context/ThemeContext';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';

const TABS: Record<string, { label: string; icon: string; iconActive: string }> = {
  explore: { label: 'Explore', icon: 'compass-outline', iconActive: 'compass' },
  trips: { label: 'Trips', icon: 'time-outline', iconActive: 'time' },
  places: { label: 'Places', icon: 'location-outline', iconActive: 'location' },
  profile: { label: 'Profile', icon: 'person-outline', iconActive: 'person' },
};

/**
 * Explore | Trips | (+) | Places | Profile (spec section 5). The centre "+"
 * is not a screen: it opens the Add menu bottom sheet.
 */
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { colors } = theme;

  const renderTab = (route: BottomTabBarProps['state']['routes'][number], index: number) => {
    const config = TABS[route.name];
    if (!config) return null;
    const focused = state.index === index;
    const color = focused ? colors.primary : colors.textMuted;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityLabel={config.label}
        accessibilityState={{ selected: focused }}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        }}
        style={styles.tab}
      >
        <Icon name={focused ? config.iconActive : config.icon} size={24} color={color} />
        <AppText variant="caption" style={{ color }}>
          {config.label}
        </AppText>
      </Pressable>
    );
  };

  const items = state.routes.map((route, index) => ({ route, index }));
  const left = items.slice(0, 2);
  const right = items.slice(2);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {left.map(({ route, index }) => renderTab(route, index))}
      <View style={styles.centerSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add"
          onPress={() => router.push('/add')}
          style={({ pressed }) => [
            styles.plus,
            { backgroundColor: colors.primary, shadowColor: colors.primary, transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
        >
          <Icon name="add" size={30} color={colors.onPrimary} />
        </Pressable>
      </View>
      {right.map(({ route, index }) => renderTab(route, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    minHeight: TAB_BAR_HEIGHT,
  },
  tab: { flex: 1, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', gap: 2 },
  centerSlot: { flex: 1, alignItems: 'center' },
  plus: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
