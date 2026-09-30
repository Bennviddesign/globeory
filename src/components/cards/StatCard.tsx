import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { AppText } from '../common/AppText';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  tint: string;
  iconColor: string;
  onPress?: () => void;
}

/** One dashboard number: `17  Countries`. */
export function StatCard({ label, value, icon, tint, iconColor, onPress }: StatCardProps) {
  return (
    <Card onPress={onPress} padded={false} style={styles.card} accessibilityLabel={`${value} ${label}`}>
      <View style={styles.inner}>
        <View style={[styles.icon, { backgroundColor: tint }]}>
          <Icon name={icon} size={18} color={iconColor} />
        </View>
        <AppText variant="title" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </Card>
  );
}

/** The four headline statistics (spec section 6). */
export function StatsRow({
  countries,
  cities,
  flights,
  hotels,
  onPressItem,
}: {
  countries: number;
  cities: number;
  flights: number;
  hotels: number;
  onPressItem?: (key: 'countries' | 'cities' | 'flights' | 'hotels') => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <StatCard label="Countries" value={countries} icon="flag" tint={colors.tintGreen} iconColor={colors.category.place} onPress={onPressItem && (() => onPressItem('countries'))} />
      <StatCard label="Cities" value={cities} icon="business" tint={colors.tintOrange} iconColor={colors.category.activity} onPress={onPressItem && (() => onPressItem('cities'))} />
      <StatCard label="Flights" value={flights} icon="airplane" tint={colors.tintBlue} iconColor={colors.category.flight} onPress={onPressItem && (() => onPressItem('flights'))} />
      <StatCard label="Hotels" value={hotels} icon="bed" tint={colors.tintPurple} iconColor={colors.category.hotel} onPress={onPressItem && (() => onPressItem('hotels'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  card: { flex: 1 },
  inner: { padding: spacing.md, gap: 2 },
  icon: { width: 32, height: 32, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  value: { fontWeight: '800' },
});
