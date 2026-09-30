import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { CLUSTER_THRESHOLD } from '@/constants/app';
import { useColors } from '@/context/ThemeContext';
import { clusterMarkers, type MarkerCluster, type ScreenMarker } from '@/services/globe/clustering';
import type { GlobeData, GlobeMarker } from '@/services/globe/globeData';
import { pathFor } from '@/services/geo/globeProjection';
import {
  clampMapZoom,
  createMapProjection,
  panMapCenter,
} from '@/services/geo/mapProjection';
import { COUNTRY_SHAPES, LAND_SHAPE } from '@/services/geo/worldData';
import { MapControls } from './MapControls';
import { MarkerLayer, PathLayer, RouteLayer } from './SceneLayers';
import { useTransformGestures } from './useTransformGestures';

interface FlatMapViewProps {
  data: GlobeData;
  width: number;
  height: number;
  center?: readonly [number, number];
  selectedIds?: readonly string[];
  onSelect?: (markers: GlobeMarker[]) => void;
}

const DEFAULT_CENTER: readonly [number, number] = [15, 35];

/**
 * The conventional geographic map (Globe / Map toggle). Flat projection with
 * pan + pinch zoom, the same markers and flight routes as the globe.
 */
export function FlatMapView({ data, width, height, center = DEFAULT_CENTER, selectedIds, onSelect }: FlatMapViewProps) {
  const colors = useColors();
  const [mapCenter, setMapCenter] = useState<[number, number]>([center[0], center[1]]);
  const [zoom, setZoom] = useState(1.6);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const panHandlers = useTransformGestures({
    onDrag: (dx, dy) => setMapCenter((c) => panMapCenter(c, dx, dy, width, zoomRef.current)),
    onPinch: (factor) => setZoom((z) => clampMapZoom(z * factor)),
  });

  const projection = useMemo(
    () => createMapProjection({ width, height, center: mapCenter, zoom }),
    [width, height, mapCenter, zoom],
  );

  const landPath = useMemo(() => pathFor(projection, LAND_SHAPE), [projection]);
  const visitedPath = useMemo(
    () =>
      COUNTRY_SHAPES.filter((s) => data.visitedIsoCodes.includes(s.id))
        .map((s) => pathFor(projection, s.shape))
        .join(' '),
    [projection, data.visitedIsoCodes],
  );
  const routePaths = useMemo(
    () =>
      data.routes.map((route) => ({
        id: route.id,
        d: pathFor(projection, { type: 'LineString', coordinates: [route.from, route.to] }),
      })),
    [projection, data.routes],
  );

  const clusters = useMemo(() => {
    const points: ScreenMarker[] = [];
    for (const marker of data.markers) {
      const p = projection([marker.longitude, marker.latitude]);
      if (p && p[0] >= -20 && p[0] <= width + 20 && p[1] >= -20 && p[1] <= height + 20) {
        points.push({ marker, x: p[0], y: p[1] });
      }
    }
    return clusterMarkers(points, 30, CLUSTER_THRESHOLD);
  }, [projection, data.markers, width, height]);

  const handlePress = useCallback(
    (cluster: MarkerCluster) => {
      if (cluster.markers.length > 1 && zoomRef.current < 8) {
        const lon = cluster.markers.reduce((s, m) => s + m.longitude, 0) / cluster.markers.length;
        const lat = cluster.markers.reduce((s, m) => s + m.latitude, 0) / cluster.markers.length;
        setMapCenter([lon, lat]);
        setZoom((z) => clampMapZoom(z * 2));
        return;
      }
      onSelect?.(cluster.markers);
    },
    [onSelect],
  );

  return (
    <View style={{ width, height, overflow: 'hidden' }} {...panHandlers}>
      <Svg width={width} height={height} accessibilityLabel="Map showing visited countries, flight routes and places">
        <Rect x={0} y={0} width={width} height={height} fill={colors.ocean} />
        <PathLayer d={landPath} fill={colors.land} stroke={colors.landStroke} strokeWidth={0.5} />
        <PathLayer d={visitedPath} fill={colors.visited} stroke={colors.landStroke} strokeWidth={0.5} opacity={0.8} />
        <RouteLayer paths={routePaths} color={colors.route} />
        <MarkerLayer clusters={clusters} colors={colors} onPress={handlePress} selectedIds={selectedIds} />
      </Svg>
      <MapControls
        label="map"
        onZoomIn={() => setZoom((z) => clampMapZoom(z * 1.6))}
        onZoomOut={() => setZoom((z) => clampMapZoom(z / 1.6))}
        onReset={() => {
          setZoom(1.6);
          setMapCenter([center[0], center[1]]);
        }}
      />
    </View>
  );
}
