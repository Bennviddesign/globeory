import { geoEquirectangular, type GeoProjection } from 'd3-geo';

export interface MapViewState {
  width: number;
  height: number;
  /** Center of the map in [longitude, latitude]. */
  center: readonly [number, number];
  zoom: number;
}

export const MAP_MIN_ZOOM = 1;
export const MAP_MAX_ZOOM = 12;

export function clampMapZoom(zoom: number): number {
  return Math.min(MAP_MAX_ZOOM, Math.max(MAP_MIN_ZOOM, zoom));
}

export function clampCenter([lon, lat]: readonly [number, number]): [number, number] {
  const wrapped = ((((lon + 180) % 360) + 360) % 360) - 180;
  return [wrapped, Math.max(-75, Math.min(80, lat))];
}

/** Flat equirectangular projection for the conventional "Map" view. */
export function createMapProjection({ width, height, center, zoom }: MapViewState): GeoProjection {
  const baseScale = width / (2 * Math.PI);
  return geoEquirectangular()
    .scale(baseScale * zoom)
    .center([center[0], center[1]])
    .translate([width / 2, height / 2]);
}

/** Pans by a pixel delta: degrees per pixel depend on the zoom level. */
export function panMapCenter(
  center: readonly [number, number],
  dx: number,
  dy: number,
  width: number,
  zoom: number,
): [number, number] {
  const degreesPerPixel = 360 / (width * zoom);
  return clampCenter([center[0] - dx * degreesPerPixel, center[1] + dy * degreesPerPixel]);
}
