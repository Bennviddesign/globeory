import { Text } from 'react-native';
import { flagEmoji } from '@/services/util/text';

/** Flag emoji for an ISO alpha-2 country code. */
export function CountryFlag({ isoCode, size = 20 }: { isoCode: string; size?: number }) {
  return (
    <Text accessible={false} style={{ fontSize: size, lineHeight: size * 1.25 }}>
      {flagEmoji(isoCode)}
    </Text>
  );
}
