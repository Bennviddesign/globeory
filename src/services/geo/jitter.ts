function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministic small offset (~0.3 degrees max) so several hotels / places in
 * the same city do not sit exactly on top of each other on the globe.
 * Used when an entry only knows its city, not an exact coordinate.
 */
export function jitterCoordinate(
  latitude: number,
  longitude: number,
  seed: string,
  maxDegrees = 0.3,
): { latitude: number; longitude: number } {
  const h = hash(seed);
  const dx = ((h & 0xffff) / 0xffff - 0.5) * 2 * maxDegrees;
  const dy = (((h >>> 16) & 0xffff) / 0xffff - 0.5) * 2 * maxDegrees;
  return { latitude: latitude + dy, longitude: longitude + dx };
}
