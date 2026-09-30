import type { ISODate, ISODateTime } from '@/models/common';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

export const nowIso = (): ISODateTime => new Date().toISOString();

const pad = (value: number) => String(value).padStart(2, '0');

/** Local calendar date of a Date as `YYYY-MM-DD`. */
export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const todayIso = (): ISODate => toISODate(new Date());

/** Parses `YYYY-MM-DD` (or a full ISO timestamp) as a local date at noon (DST safe). */
export function parseISODate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseISODate(value);
  return toISODate(date) === value;
}

export function yearOf(value: string): number {
  return Number(value.slice(0, 4));
}

/** `11 Apr 2026`. */
export function formatDate(value: string): string {
  const date = parseISODate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** `11 Apr`. */
export function formatDayMonth(value: string): string {
  const date = parseISODate(value);
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]}`;
}

/** `11 Apr – 12 May 2026`, collapsing repeated parts. */
export function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  const a = parseISODate(start);
  const b = parseISODate(end);
  if (a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** `14:35` from an ISO timestamp (local time). */
export function formatTime(value: ISODateTime): string {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Inclusive number of calendar days between two dates (same day = 1). */
export function daysInclusive(start: string, end: string): number {
  const diff = Math.round((parseISODate(end).getTime() - parseISODate(start).getTime()) / DAY_MS);
  return Math.max(1, diff + 1);
}

export function addDays(value: ISODate, days: number): ISODate {
  const date = parseISODate(value);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** `3 days ago`, `2 weeks ago`, `Just now`. */
export function timeAgo(value: ISODateTime, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.round((now.getTime() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return days === 1 ? '1 day ago' : `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 18) return `${months} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/** ISO timestamp `days` days before now. Used by the demo seed. */
export function daysAgoIso(days: number, hourOffset = 0): ISODateTime {
  return new Date(Date.now() - days * DAY_MS - hourOffset * 3600 * 1000).toISOString();
}
