import { useColors } from '@/context/ThemeContext';
import type { Database } from '@/models/database';
import type { Hotel } from '@/models/hotel';
import { describeCity } from '@/services/data/lookup';
import { formatDateRange } from '@/services/util/dates';
import { EntryRow } from './EntryRow';

export function HotelRow({ db, hotel, onPress }: { db: Database; hotel: Hotel; onPress?: () => void }) {
  const colors = useColors();
  return (
    <EntryRow
      title={hotel.name}
      subtitle={describeCity(db, hotel.city_id).text}
      meta={formatDateRange(hotel.check_in, hotel.check_out)}
      icon="bed"
      color={colors.category.hotel}
      onPress={onPress}
    />
  );
}
