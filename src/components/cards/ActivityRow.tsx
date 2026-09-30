import { ACTIVITY_TYPE_LABELS, PLACE_TYPE_LABELS } from '@/constants/categories';
import { useColors } from '@/context/ThemeContext';
import type { Activity } from '@/models/activity';
import type { Database } from '@/models/database';
import type { Place } from '@/models/place';
import { describeCity } from '@/services/data/lookup';
import { formatDate } from '@/services/util/dates';
import { EntryRow } from './EntryRow';

export function ActivityRow({ db, activity, onPress }: { db: Database; activity: Activity; onPress?: () => void }) {
  const colors = useColors();
  return (
    <EntryRow
      title={activity.name}
      subtitle={`${ACTIVITY_TYPE_LABELS[activity.type]} · ${describeCity(db, activity.city_id).cityName}`}
      meta={formatDate(activity.date)}
      icon="walk"
      color={colors.category.activity}
      onPress={onPress}
    />
  );
}

export function PlaceRow({ db, place, onPress }: { db: Database; place: Place; onPress?: () => void }) {
  const colors = useColors();
  return (
    <EntryRow
      title={place.name}
      subtitle={`${PLACE_TYPE_LABELS[place.type]} · ${describeCity(db, place.city_id).cityName}`}
      meta={formatDate(place.date)}
      icon="location"
      color={colors.category.place}
      onPress={onPress}
    />
  );
}
