/** Lowercase, accent-free text used for searching (`Malmö` matches `malmo`). */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Flag emoji from an ISO 3166-1 alpha-2 code. */
export function flagEmoji(isoAlpha2: string): string {
  if (isoAlpha2.length !== 2) return '🌍';
  const base = 0x1f1e6;
  const a = isoAlpha2.toUpperCase().charCodeAt(0) - 65;
  const b = isoAlpha2.toUpperCase().charCodeAt(1) - 65;
  return String.fromCodePoint(base + a, base + b);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
