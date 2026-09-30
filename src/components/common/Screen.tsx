import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { PAGE_PADDING } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';

interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView (default). */
  scroll?: boolean;
  /** Horizontal page padding. */
  padded?: boolean;
  edges?: Edge[];
  /** Extra space at the bottom (e.g. above the floating tab bar). */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/** Themed, safe-area aware page container. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
  bottomInset = 32,
  contentStyle,
  refreshing,
  onRefresh,
}: ScreenProps) {
  const colors = useColors();
  const padding = padded ? PAGE_PADDING : 0;

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.background }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingHorizontal: padding, paddingBottom: bottomInset }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingHorizontal: padding }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
