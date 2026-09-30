import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { MIN_TOUCH } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { Icon } from './Icon';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  /** Adds a filled circular background. */
  filled?: boolean;
  color?: string;
  badge?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 44x44 touch target icon button with a required screen-reader label. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 22,
  filled = false,
  color,
  badge = false,
  style,
}: IconButtonProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        filled && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth },
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Icon name={icon} size={size} color={color ?? colors.text} />
      {badge ? <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.surface }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
});
