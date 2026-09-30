import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, RadialGradient, Stop } from 'react-native-svg';
import { CLUSTER_THRESHOLD } from '@/constants/app';
import { useColors } from '@/context/ThemeContext';
import { clusterMarkers, type MarkerCluster, type ScreenMarker } from '@/services/globe/clustering';
import type { GlobeData, GlobeMarker } from '@/services/globe/globeData';
import {
  clampZoom,
  createGlobeProjection,
  graticulePath,
  pathFor,
  projectPoint,
  rotateByDrag,
  rotationFor,
  type Rotation,
} from '@/services/geo/globeProjection';
import { COUNTRY_SHAPES, LAND_SHAPE } from '@/services/geo/worldData';
import { MapControls } from './MapControls';
import { MarkerLayer, PathLayer, RouteLayer } from './SceneLayers';
import { useTransformGestures } from './useTransformGestures';

interface GlobeViewProps {
  data: GlobeData;
  size: number;
  /** Initial [longitude, latitude] at the center of the globe. */
  center?: readonly [number, number];
  selectedIds?: readonly string[];
  onSelect?: (markers: GlobeMarker[]) => void;
  showControls?: boolean;
  /** Disable drag/pinch (used for the small preview on profiles). */
  interactive?: boolean;
  /** When false the globe can still be rotated but markers ignore taps (preview mode). */
  markersPressable?: boolean;
  /** Pure display (feed cards): no gestures, taps, zoom or controls. Overrides the two props above. */
  readOnly?: boolean;
}

const noopPress = () => {};
const DEFAULT_CENTER: readonly [number, number] = [15, 40];

/**
 * Interactive 3D-looking globe drawn with an orthographic projection
 * (react-native-svg + d3-geo). Works offline and inside Expo Go: rotate with
 * touch, pinch/zoom, visited countries highlighted, flight arcs, markers.
 */
export function GlobeView({
  data,
  size,
  center = DEFAULT_CENTER,
  selectedIds,
  onSelect,
  showControls = true,
  interactive: interactiveProp = true,
  markersPressable: markersPressableProp = true,
  readOnly = false,
}: GlobeViewProps) {
  const interactive = interactiveProp && !readOnly;
  const markersPressable = markersPressableProp && !readOnly;
  const colors = useColors();
  const [rotation, setRotation] = useState<Rotation>(() => rotationFor(center[0], center[1]));
  const [zoom, setZoom] = useState(1);
  const pendingRotation = useRef<Rotation>(rotation);
  const frame = useRef<number | null>(null);

  // Re-center when the requested center changes (e.g. after selecting a marker).
  const [centerLon, centerLat] = center;
  useEffect(() => {
    const next = rotationFor(centerLon, centerLat);
    pendingRotation.current = next;
    setRotation(next);
  }, [centerLon, centerLat]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const scheduleRotation = useCallback((next: Rotation) => {
    pendingRotation.current = next;
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      setRotation(pendingRotation.current);
    });
  }, []);

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const panHandlers = useTransformGestures({
    onDrag: (dx, dy) => scheduleRotation(rotateByDrag(pendingRotation.current, dx, dy, zoomRef.current)),
    captureTouches: !markersPressable && interactive,
    onPinch: (factor) => {
      if (markersPressable) setZoom((z) => clampZoom(z * factor)); // preview globes: rotate only
    },
  });

  const projection = useMemo(() => createGlobeProjection({ size, rotation, zoom }), [size, rotation, zoom]);
  const radius = (size / 2) * 0.92 * zoom;

  const landPath = useMemo(() => pathFor(projection, LAND_SHAPE), [projection]);
  const gridPath = useMemo(() => graticulePath(projection), [projection]);
  const visitedPath = useMemo(() => {
    const features = COUNTRY_SHAPES.filter((s) => data.visitedIsoCodes.includes(s.id)).map((s) => s.shape);
    if (features.length === 0) return '';
    return features.map((shape) => pathFor(projection, shape)).join(' ');
  }, [projection, data.visitedIsoCodes]);

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
      const p = projectPoint(projection, marker.longitude, marker.latitude);
      if (p?.visible) points.push({ marker, x: p.x, y: p.y });
    }
    return clusterMarkers(points, 30, CLUSTER_THRESHOLD);
  }, [projection, data.markers]);

  const handlePress = useCallback(
    (cluster: MarkerCluster) => {
      if (!markersPressable) return;
      if (cluster.markers.length > 1) {
        // Zoom into dense clusters first, like a map would.
        const lon = cluster.markers.reduce((s, m) => s + m.longitude, 0) / cluster.markers.length;
        const lat = cluster.markers.reduce((s, m) => s + m.latitude, 0) / cluster.markers.length;
        if (zoomRef.current < 2.6) {
          scheduleRotation(rotationFor(lon, lat));
          setZoom((z) => clampZoom(z * 1.8));
          return;
        }
      }
      onSelect?.(cluster.markers);
    },
    [onSelect, scheduleRotation, markersPressable],
  );

  return (
    <View style={{ width: size, height: size }} {...(interactive ? panHandlers : {})}>
      <Svg
        pointerEvents={markersPressable ? 'auto' : 'none'}
        width={size}
        height={size}
        accessibilityLabel="Interactive globe showing visited countries, flight routes and places"
      >
        <Defs>
          <RadialGradient id="ocean" cx="38%" cy="32%" r="80%">
            <Stop offset="0" stopColor={colors.ocean} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.oceanGlow} stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Soft atmosphere glow */}
        <Circle cx={size / 2} cy={size / 2} r={radius + 10} fill={colors.oceanGlow} />
        <Circle cx={size / 2} cy={size / 2} r={radius} fill={colors.ocean} />
        <Circle cx={size / 2} cy={size / 2} r={radius} fill="url(#ocean)" opacity={0.55} />
        <PathLayer d={gridPath} stroke={colors.graticule} strokeWidth={0.6} />
        <PathLayer d={landPath} fill={colors.land} stroke={colors.landStroke} strokeWidth={0.5} />
        <PathLayer d={visitedPath} fill={colors.visited} stroke={colors.landStroke} strokeWidth={0.5} opacity={0.85} />
        <RouteLayer paths={routePaths} color={colors.route} />
        {/* Outline drawn BEFORE the markers: a full-size shape on top would swallow every tap. */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.landStroke}
          strokeWidth={1}
          opacity={0.6}
          pointerEvents="none"
        />
        <G pointerEvents={markersPressable ? 'auto' : 'none'}>
          <MarkerLayer clusters={clusters} colors={colors} onPress={markersPressable ? handlePress : noopPress} selectedIds={selectedIds} />
        </G>
      </Svg>
      {showControls && interactive ? (
        <MapControls
          label="globe"
          onZoomIn={() => setZoom((z) => clampZoom(z * 1.4))}
          onZoomOut={() => setZoom((z) => clampZoom(z / 1.4))}
          onReset={() => {
            setZoom(1);
            scheduleRotation(rotationFor(centerLon, centerLat));
          }}
        />
      ) : null}
    </View>
  );
}
