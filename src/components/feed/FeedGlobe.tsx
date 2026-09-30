import { memo } from 'react';
import { View } from 'react-native';
import type { GlobeData } from '@/services/globe/globeData';
import { GlobeView } from '../globe/GlobeView';

interface FeedGlobeProps {
  data: GlobeData;
  size: number;
  /** [longitude, latitude] the globe faces. */
  center: readonly [number, number];
}

/**
 * Mini globe for a feed card. Completely non-interactive so a finger that
 * starts on it keeps scrolling the list.
 */
export const FeedGlobe = memo(function FeedGlobe({ data, size, center }: FeedGlobeProps) {
  return (
    <View pointerEvents="none" style={{ alignItems: 'center' }}>
      <GlobeView data={data} size={size} center={center} interactive={false} markersPressable={false} showControls={false} readOnly />
    </View>
  );
});
