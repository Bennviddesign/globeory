import type { GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import worldTopologyJson from 'world-atlas/countries-110m.json';

/**
 * Natural Earth 110m world data, bundled with the app so the globe and map
 * work fully offline.
 */
const topology = worldTopologyJson as unknown as Topology;

export interface CountryShape {
  /** ISO 3166-1 numeric code (string, zero padded). */
  id: string;
  name: string;
  shape: GeoPermissibleObjects;
}

const countryCollection = feature(
  topology,
  topology.objects.countries as GeometryCollection,
);

/** All country polygons keyed by their ISO numeric id. */
export const COUNTRY_SHAPES: readonly CountryShape[] = countryCollection.features.map((f) => ({
  id: String(f.id ?? ''),
  name: String((f.properties as { name?: string } | null)?.name ?? ''),
  shape: f as unknown as GeoPermissibleObjects,
}));

/** The whole land mass as a single geometry (cheap to draw). */
export const LAND_SHAPE = feature(
  topology,
  topology.objects.land as GeometryCollection,
) as unknown as GeoPermissibleObjects;

const SHAPES_BY_ID = new Map(COUNTRY_SHAPES.map((s) => [s.id, s]));

/** ISO alpha-2 -> ISO numeric for every country in the reference data. */
const ISO_ALPHA2_TO_NUMERIC: Record<string, string> = {
  SE: '752',
  DK: '208',
  NO: '578',
  TH: '764',
  FR: '250',
  IT: '380',
  ES: '724',
  JP: '392',
  KR: '410',
  DE: '276',
  GB: '826',
  NL: '528',
  PT: '620',
  GR: '300',
  US: '840',
  AE: '784',
  TR: '792',
  AU: '036',
  // Singapore (SG) is too small for the 110m dataset; it is shown as a marker.
};

export function shapeForIsoCode(isoAlpha2: string): CountryShape | undefined {
  const numeric = ISO_ALPHA2_TO_NUMERIC[isoAlpha2];
  return numeric ? SHAPES_BY_ID.get(numeric) : undefined;
}
