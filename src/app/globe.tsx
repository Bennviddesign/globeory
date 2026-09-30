import { useLocalSearchParams } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AppText } from '@/components/common/AppText';
import { GlobeSection } from '@/components/globe/GlobeSection';
import { PAGE_PADDING } from '@/constants/layout';
import { useData } from '@/context/DataContext';
import { useStats } from '@/context/useTravelData';
import { pluralize } from '@/services/util/text';

/** My World (spec section 8): full globe / map with filters. `?owner=` shows someone else's permitted world. */
export default function GlobeScreen() {
  const { owner } = useLocalSearchParams<{ owner?: string }>();
  const { width } = useWindowDimensions();
  const { currentUserId } = useData();
  const ownerId = owner ?? currentUserId ?? '';
  const stats = useStats(ownerId);

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader
        title={ownerId === currentUserId ? 'My World' : 'World'}
        subtitle={`${pluralize(stats.countries, 'country', 'countries')} · ${pluralize(stats.cities, 'city', 'cities')}`}
        back
      />
      <GlobeSection ownerId={ownerId} width={Math.min(width - PAGE_PADDING * 2, 480)} mapHeight={360} />
      <AppText variant="small" tone="muted" style={{ textAlign: 'center', marginTop: 16 }}>
        Drag to rotate, pinch to zoom, tap a marker for details.
      </AppText>
    </Screen>
  );
}
