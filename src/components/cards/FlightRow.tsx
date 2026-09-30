import { useColors } from '@/context/ThemeContext';
import { useUnit } from '@/context/useTravelData';
import type { Database } from '@/models/database';
import type { Flight } from '@/models/flight';
import { describeCity, getAirport } from '@/services/data/lookup';
import { formatDistance } from '@/services/geo/distance';
import { formatDate } from '@/services/util/dates';
import { EntryRow } from './EntryRow';

interface FlightRowProps {
  db: Database;
  flight: Flight;
  onPress?: () => void;
}

/** `Copenhagen → Bangkok`, IATA codes, date and the automatically calculated distance. */
export function FlightRow({ db, flight, onPress }: FlightRowProps) {
  const colors = useColors();
  const unit = useUnit();
  const dep = getAirport(db, flight.departure_airport_id);
  const arr = getAirport(db, flight.arrival_airport_id);
  const title = `${describeCity(db, dep?.city_id).cityName} → ${describeCity(db, arr?.city_id).cityName}`;
  const codes = `${dep?.iata_code ?? '?'} → ${arr?.iata_code ?? '?'}`;
  const airline = [flight.airline, flight.flight_number].filter(Boolean).join(' ');

  return (
    <EntryRow
      title={title}
      subtitle={`${codes} · ${formatDistance(flight.distance_km, unit)}`}
      meta={[formatDate(flight.departure_datetime.slice(0, 10)), airline].filter(Boolean).join(' · ')}
      icon="airplane"
      color={colors.category.flight}
      onPress={onPress}
    />
  );
}
