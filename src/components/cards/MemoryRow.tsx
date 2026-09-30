import type { Database } from '@/models/database';
import type { Memory } from '@/models/memory';
import { describeCity } from '@/services/data/lookup';
import { formatDate } from '@/services/util/dates';
import { EntryRow } from './EntryRow';

export function MemoryRow({ db, memory, onPress }: { db: Database; memory: Memory; onPress?: () => void }) {
  const where = memory.city_id ? describeCity(db, memory.city_id).cityName : null;
  return (
    <EntryRow
      title={memory.title}
      subtitle={memory.description}
      meta={[formatDate(memory.date), where].filter(Boolean).join(' · ')}
      icon="heart"
      color="#EC4899"
      onPress={onPress}
    />
  );
}
