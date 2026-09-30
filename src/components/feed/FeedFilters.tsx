import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import type { FeedFilter, FeedScope, FeedSort } from '@/services/feed/feedTypes';
import { SegmentedControl } from '../common/SegmentedControl';

const SCOPES = [
  { value: 'city', label: 'City', icon: 'business' },
  { value: 'country', label: 'Country', icon: 'flag' },
  { value: 'airport', label: 'Airport', icon: 'airplane' },
] as const;

const SORTS = [
  { value: 'recent', label: 'Latest' },
  { value: 'most', label: 'Most visited' },
] as const;

interface FeedFiltersProps {
  filter: FeedFilter;
  onScopeChange: (scope: FeedScope) => void;
  onSortChange: (sort: FeedSort) => void;
}

/** City / Country / Airport plus Latest / Most visited. */
export const FeedFilters = memo(function FeedFilters({ filter, onScopeChange, onSortChange }: FeedFiltersProps) {
  return (
    <View style={styles.container}>
      <SegmentedControl options={SCOPES} value={filter.scope} onChange={onScopeChange} />
      <SegmentedControl options={SORTS} value={filter.sort} onChange={onSortChange} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingBottom: spacing.md },
});
