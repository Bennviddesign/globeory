let counter = 0;

/** Collision-resistant local id, e.g. `visit_lq3x9k2a_4f`. Replaced by UUIDs in Supabase later. */
export function newId(prefix: string): string {
  counter = (counter + 1) % 1296;
  const time = Date.now().toString(36);
  const random = Math.floor(Math.random() * 1296)
    .toString(36)
    .padStart(2, '0');
  return `${prefix}_${time}${random}${counter.toString(36)}`;
}
