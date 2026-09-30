import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CATEGORY_LABELS, GLOBE_FILTERS, type GlobeFilter } from '@/constants/categories';
import { spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { useScopedDb } from '@/context/useTravelData';
import type { ID } from '@/models/common';
import { getCity } from '@/services/data/lookup';
import { buildGlobeData, type GlobeMarker } from '@/services/globe/globeData';
import { FilterChip } from '../common/FilterChip';
import { SegmentedControl } from '../common/SegmentedControl';
import { FlatMapView } from './FlatMapView';
import { GlobeView } from './GlobeView';
import { MarkerSheet } from './MarkerSheet';

type ViewMode = 'globe' | 'map';

interface GlobeSectionProps {
  /** Whose travel history is shown. Only data the viewer may see is drawn. */
  ownerId: ID;
  width: number;
  /** Height of the map view (the globe is always square). */
  mapHeight?: number;
  showToggle?: boolean;
  showFilters?: boolean;
  /** Preview mode: no gestures, no controls, no marker sheet. */
  interactive?: boolean;
  initialMode?: ViewMode;
  initialFilter?: GlobeFilter;
  /** Called when a marker is tapped (before the sheet opens). */
  onMarkerSelected?: (markers: GlobeMarker[]) => void;
}

const DEFAULT_CENTER: readonly [number, number] = [15, 40];

/**
 * Globe + Map toggle + category filters + marker bottom sheet in one piece,
 * used by Explore, the My World screen and profiles.
 */
export function GlobeSection({
  ownerId,
  width,
  mapHeight,
  showToggle = true,
  showFilters = true,
  interactive = true,
  initialMode = 'globe',
  initialFilter = 'all',
  onMarkerSelected,
}: GlobeSectionProps) {
  const colors = useColors();
  const scoped = useScopedDb(ownerId);
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [filter, setFilter] = useState<GlobeFilter>(initialFilter);
  const [selected, setSelected] = useState<GlobeMarker[] | null>(null);
  const [focus, setFocus] = useState<readonly [number, number] | null>(null);

  const data = useMemo(() => buildGlobeData(scoped, ownerId, filter), [scoped, ownerId, filter]);

  // The globe opens on the most recent visit.
  const home = useMemo<readonly [number, number]>(() => {
    const latest = [...scoped.destination_visits]
      .filter((v) => v.user_id === ownerId)
      .sort((a, b) => b.visit_date.localeCompare(a.visit_date))[0];
    const city = getCity(scoped, latest?.city_id);
    return city ? [city.longitude, city.latitude] : DEFAULT_CENTER;
  }, [scoped, ownerId]);
  const center = focus ?? home;

  const handleSelect = (markers: GlobeMarker[]) => {
    if (!interactive) return;
    onMarkerSelected?.(markers);
    setSelected(markers);
    if (markers.length === 1) setFocus([markers[0].longitude, markers[0].latitude]);
  };

  return (
    <View style={styles.container}>
      {showToggle ? (
        <View style={styles.toggle}>
          <SegmentedControl
            options={[
              { value: 'globe', label: 'Globe', icon: 'earth' },
              { value: 'map', label: 'Map', icon: 'map' },
            ]}
            value={mode}
            onChange={setMode}
          />
        </View>
      ) : null}

      <View style={{ alignItems: 'center' }}>
        {mode === 'globe' ? (
          <GlobeView
            data={data}
            size={width}
            center={center}
            onSelect={handleSelect}
            selectedIds={selected?.map((m) => m.id)}
            interactive
            markersPressable={interactive}
            showControls={interactive}
          />
        ) : (
          <View style={[styles.mapFrame, { borderColor: colors.border }]}>
            <FlatMapView
              data={data}
              width={width}
              height={mapHeight ?? Math.round(width * 0.8)}
              center={center}
              onSelect={handleSelect}
              selectedIds={selected?.map((m) => m.id)}
            />
          </View>
        )}
      </View>

      {showFilters ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {GLOBE_FILTERS.map((option) => (
            <FilterChip
              key={option.key}
              label={option.key === 'all' ? 'All' : CATEGORY_LABELS[option.key]}
              selected={filter === option.key}
              dotColor={option.key === 'all' ? undefined : colors.category[option.key]}
              onPress={() => setFilter(option.key)}
            />
          ))}
        </ScrollView>
      ) : null}

      <MarkerSheet markers={selected} ownerId={ownerId} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  toggle: { alignSelf: 'center', width: 220 },
  filters: { gap: spacing.sm, paddingHorizontal: 2 },
  mapFrame: { borderRadius: 20, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
});
