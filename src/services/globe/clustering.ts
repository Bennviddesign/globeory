import type { GlobeMarker } from './globeData';

export interface ScreenMarker {
  marker: GlobeMarker;
  x: number;
  y: number;
}

export interface MarkerCluster {
  id: string;
  x: number;
  y: number;
  markers: GlobeMarker[];
}

/**
 * Screen-space grid clustering (spec sections 7 and 48). Markers that fall in
 * the same grid cell are merged into one cluster. Clustering is only applied
 * above `threshold` so sparse globes stay exact.
 *
 * Returns single markers as clusters with one entry so callers render both
 * with one code path.
 */
export function clusterMarkers(
  points: readonly ScreenMarker[],
  cellSize: number,
  threshold: number,
): MarkerCluster[] {
  if (points.length <= threshold) {
    return points.map((p) => ({ id: p.marker.id, x: p.x, y: p.y, markers: [p.marker] }));
  }

  const cells = new Map<string, ScreenMarker[]>();
  for (const p of points) {
    const key = `${Math.floor(p.x / cellSize)}:${Math.floor(p.y / cellSize)}`;
    const list = cells.get(key);
    if (list) list.push(p);
    else cells.set(key, [p]);
  }

  return [...cells.entries()].map(([key, list]) => ({
    id: list.length === 1 ? list[0].marker.id : `cluster-${key}`,
    x: list.reduce((s, p) => s + p.x, 0) / list.length,
    y: list.reduce((s, p) => s + p.y, 0) / list.length,
    markers: list.map((p) => p.marker),
  }));
}
