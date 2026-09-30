import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/context/ThemeContext';
import { resolveImageUri, type ImageSize } from '@/services/images/imageService';
import { Icon } from './Icon';

interface DestinationImageProps {
  /** The single representative image of a visit (or trip cover). `null` shows a placeholder. */
  path: string | null | undefined;
  size?: ImageSize;
  style?: StyleProp<ViewStyle>;
  /** Shown on top of the placeholder so users see there is simply no image yet. */
  placeholderIcon?: string;
  accessibilityLabel?: string;
}

/**
 * Lazy-loaded image with a graceful placeholder (no image, offline or failed
 * download). Thumbnails for cards, medium size for detail screens.
 */
export function DestinationImage({
  path,
  size = 'thumb',
  style,
  placeholderIcon = 'image-outline',
  accessibilityLabel,
}: DestinationImageProps) {
  const colors = useColors();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [path]);
  const showImage = Boolean(path) && !failed;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceMuted }, style]}>
      {showImage ? (
        <Image
          source={{ uri: resolveImageUri(path as string, size) }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          recyclingKey={path ?? undefined}
          accessibilityLabel={accessibilityLabel}
          onError={() => setFailed(true)}
        />
      ) : (
        <LinearGradient
          colors={[colors.tintBlue, colors.tintPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.placeholder}
        >
          <Icon name={placeholderIcon} size={28} color={colors.textMuted} />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
