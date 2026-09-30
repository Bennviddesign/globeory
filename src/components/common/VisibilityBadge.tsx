import { View } from 'react-native';
import { VISIBILITY_LABELS, type Visibility } from '@/models/common';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from './AppText';
import { Icon } from './Icon';

const ICONS: Record<Visibility, string> = {
  public: 'globe-outline',
  followers: 'people-outline',
  private: 'lock-closed-outline',
};

/** Small chip showing Public / Followers / Private. */
export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  const colors = useColors();
  return (
    <View
      accessibilityLabel={`Visibility: ${VISIBILITY_LABELS[visibility]}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radii.pill,
        backgroundColor: colors.surfaceMuted,
      }}
    >
      <Icon name={ICONS[visibility]} size={12} color={colors.textMuted} />
      <AppText variant="caption" tone="muted">
        {VISIBILITY_LABELS[visibility]}
      </AppText>
    </View>
  );
}
