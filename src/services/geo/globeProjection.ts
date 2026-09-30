import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
  type GeoProjection,
} from 'd3-geo';

export type Rotation = readonly [lambda: number, phi: number];

export interface GlobeViewState {
  size: number;
  rotation: Rotation;
  zoom: number;
}

export const MIN_ZOOM = 0.8;
export const MAX_ZOOM = 4;
const MAX_LATITUDE_TILT = 80;

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function clampRotation([lambda, phi]: Rotation): Rotation {
  const wrapped = ((((lambda + 180) % 360) + 360) % 360) - 180;
  return [wrapped, Math.max(-MAX_LATITUDE_TILT, Math.min(MAX_LATITUDE_TILT, phi))];
}

/** Rotation that puts the given coordinate at the center of the globe. */
export function rotationFor(longitude: number, latitude: number): Rotation {
  return clampRotation([-longitude, -latitude]);
}

/** Orthographic projection for the 3D-looking globe. */
export function createGlobeProjection({ size, rotation, zoom }: GlobeViewState): GeoProjection {
  const radius = (size / 2) * 0.92 * zoom;
  return geoOrthographic()
    .translate([size / 2, size / 2])
    .scale(radius)
    .rotate([rotation[0], rotation[1], 0])
    .clipAngle(90);
}

export interface ProjectedPoint {
  x: number;
  y: number;
  /** True when the point is on the visible hemisphere. */
  visible: boolean;
}

export function projectPoint(
  projection: GeoProjection,
  longitude: number,
  latitude: number,
): ProjectedPoint | null {
  const point = projection([longitude, latitude]);
  if (!point) return null;
  const [lambda, phi] = projection.rotate();
  const visible = geoDistance([longitude, latitude], [-lambda, -phi]) < Math.PI / 2 - 0.02;
  return { x: point[0], y: point[1], visible };
}

export function pathFor(projection: GeoProjection, shape: GeoPermissibleObjects): string {
  return geoPath(projection)(shape) ?? '';
}

export function graticulePath(projection: GeoProjection): string {
  return pathFor(projection, geoGraticule10());
}

/** Pure helper used by the drag gesture. Degrees of rotation per pixel shrink as we zoom in. */
export function rotateByDrag(rotation: Rotation, dx: number, dy: number, zoom: number): Rotation {
  const degreesPerPixel = 0.35 / zoom;
  return clampRotation([rotation[0] + dx * degreesPerPixel, rotation[1] - dy * degreesPerPixel]);
}
