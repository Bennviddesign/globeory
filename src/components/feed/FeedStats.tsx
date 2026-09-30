import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import type { FeedHighlight, FeedStatsData } from '@/services/feed/feedTypes';
import { formatDate } from '@/services/util/dates';
import { pluralize } from '@/services/util/text';
import { StatCard } from '../cards/StatCard';
import { AppText } from '../common/AppText';
import { CountryFlag } from '../common/CountryFlag';

interface FeedStatsProps {
  stats: FeedStatsData;
  highlight: FeedHighlight;
}

/** Highlight line for the selected filter, then the profile-style stat cards. */
export const FeedStats = memo(function FeedStats({ stats, highlight }: FeedStatsProps) {
  const colors = useColors();
  const unit = highlight.scope === 'airport' ? 'flight' : 'visit';

  return (
    <View style={styles.container}>
      <View style={[styles.highlight, { backgroundColor: colors.tintBlue }]}>
        {highlight.isoCode ? <CountryFlag isoCode={highlight.isoCode} size={24} /> : null}
        <View style={styles.texts}>
          <AppText variant="bodyLarge" numberOfLines={1}>
            {highlight.label}
          </AppText>
          <AppText variant="small" tone="secondary" numberOfLines={1}>
            {[highlight.sublabel, `${pluralize(highlight.count, unit)} · last ${formatDate(highlight.lastDate)}`].filter(Boolean).join(' · ')}
          </AppText>
        </View>
      </View>
      <View style={styles.row}>
        <StatCard label="Countries" value={stats.countries} icon="flag" tint={colors.tintGreen} iconColor={colors.category.place} />
        <StatCard label="Cities" value={stats.cities} icon="business" tint={colors.tintOrange} iconColor={colors.category.activity} />
        <StatCard label="Flights" value={stats.flights} icon="airplane" tint={colors.tintBlue} iconColor={colors.category.flight} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  highlight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radii.lg },
  texts: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
});
