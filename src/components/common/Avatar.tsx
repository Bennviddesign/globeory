import { Image } from 'expo-image';
import { View } from 'react-native';
import { useColors } from '@/context/ThemeContext';
import { initialsOf } from '@/services/util/text';
import { AppText } from './AppText';

interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
  ring?: boolean;
}

/** Circular avatar with an initials fallback. */
export function Avatar({ name, uri, size = 44, ring = false }: AvatarProps) {
  const colors = useColors();
  return (
    <View
      accessibilityLabel={`${name} avatar`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.tintBlue,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: ring ? 3 : 0,
        borderColor: colors.background,
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="cover" transition={150} />
      ) : (
        <AppText variant="label" tone="primary" style={{ fontSize: size * 0.36 }}>
          {initialsOf(name)}
        </AppText>
      )}
    </View>
  );
}
