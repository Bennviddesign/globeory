import { memo } from 'react';
import { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import type { ThemeColors } from '@/constants/theme';
import type { MarkerCluster } from '@/services/globe/clustering';
import type { GlobeMarker } from '@/services/globe/globeData';

interface PathLayerProps {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

/** A single pre-computed SVG path (land, graticule, visited countries). */
export const PathLayer = memo(function PathLayer({ d, fill = 'none', stroke = 'none', strokeWidth = 0.6, opacity = 1 }: PathLayerProps) {
  if (!d) return null;
  return <Path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />;
});

interface RouteLayerProps {
  paths: { id: string; d: string }[];
  color: string;
}

/** Flight routes as curved (great-circle) arcs. */
export const RouteLayer = memo(function RouteLayer({ paths, color }: RouteLayerProps) {
  return (
    <G>
      {paths.map((route) => (
        <Path
          key={route.id}
          d={route.d}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
    </G>
  );
});

interface MarkerLayerProps {
  clusters: MarkerCluster[];
  colors: ThemeColors;
  onPress: (cluster: MarkerCluster) => void;
  selectedIds?: readonly string[];
}

/** Category-colored markers; dense areas collapse into numbered clusters. */
export const MarkerLayer = memo(function MarkerLayer({ clusters, colors, onPress, selectedIds = [] }: MarkerLayerProps) {
  return (
    <G>
      {clusters.map((cluster) => {
        const isCluster = cluster.markers.length > 1;
        const first: GlobeMarker = cluster.markers[0];
        const color = isCluster ? colors.primary : colors.category[first.category];
        const selected = cluster.markers.some((m) => selectedIds.includes(m.id));
        const radius = isCluster ? 11 : first.refType === 'city' ? 5.5 : 4.5;
        return (
          <G key={cluster.id} onPress={() => onPress(cluster)}>
            {/* Larger invisible circle = comfortable touch target. */}
            <Circle cx={cluster.x} cy={cluster.y} r={18} fill="transparent" />
            {selected ? <Circle cx={cluster.x} cy={cluster.y} r={radius + 6} fill={color} opacity={0.25} /> : null}
            <Circle cx={cluster.x} cy={cluster.y} r={radius} fill={color} stroke="#FFFFFF" strokeWidth={1.6} />
            {isCluster ? (
              <SvgText
                x={cluster.x}
                y={cluster.y + 4}
                fontSize={11}
                fontWeight="700"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                {cluster.markers.length}
              </SvgText>
            ) : null}
          </G>
        );
      })}
    </G>
  );
});
