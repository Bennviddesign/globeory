import { Pressable, StyleSheet, View } from 'react-native';
import { categoryColors } from '@/constants/colors';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';
import { BottomSheet } from './BottomSheet';

export type AddKind = 'trip' | 'visit' | 'flight' | 'hotel' | 'place' | 'activity' | 'memory';

interface AddOption {
  kind: AddKind;
  label: string;
  description: string;
  icon: string;
  color: string;
}

/** The "+" menu (spec section 16): Trip, Flight, Hotel, Place, Activity, Memory (+ destination visit). */
export const ADD_OPTIONS: readonly AddOption[] = [
  { kind: 'trip', label: 'Trip', description: 'Group a journey together', icon: 'briefcase', color: '#0EA5E9' },
  { kind: 'visit', label: 'Destination visit', description: 'A city you visited, with one image', icon: 'earth', color: categoryColors.place },
  { kind: 'flight', label: 'Flight', description: 'Distance is calculated for you', icon: 'airplane', color: categoryColors.flight },
  { kind: 'hotel', label: 'Hotel', description: 'Where you stayed', icon: 'bed', color: categoryColors.hotel },
  { kind: 'place', label: 'Place', description: 'Landmarks, restaurants, beaches', icon: 'location', color: categoryColors.place },
  { kind: 'activity', label: 'Activity', description: 'Things you did', icon: 'walk', color: categoryColors.activity },
  { kind: 'memory', label: 'Memory', description: 'A personal note or moment', icon: 'heart', color: '#EC4899' },
];

interface AddMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (kind: AddKind) => void;
}

export function AddMenuSheet({ visible, onClose, onSelect }: AddMenuSheetProps) {
  const colors = useColors();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add to your world">
      <View style={styles.grid}>
        {ADD_OPTIONS.map((option) => (
          <Pressable
            key={option.kind}
            onPress={() => onSelect(option.kind)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${option.label}`}
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: option.color + '22' }]}>
              <Icon name={option.icon} size={22} color={option.color} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyLarge">{option.label}</AppText>
              <AppText variant="small" tone="muted">
                {option.description}
              </AppText>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.sm, paddingBottom: spacing.md },
  row: {
    minHeight: MIN_TOUCH + 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  icon: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
});
