import { useCallback, useMemo, useState } from 'react';
import { buildFeed } from '@/services/feed/feedService';
import { DEFAULT_FEED_FILTER, type FeedCard, type FeedFilter, type FeedScope, type FeedSort } from '@/services/feed/feedTypes';
import { useData } from './DataContext';

/** Feed data + filter state. The feed is only rebuilt when the data or the filter changes. */
export function useFeed() {
  const { db, currentUserId } = useData();
  const [filter, setFilter] = useState<FeedFilter>(DEFAULT_FEED_FILTER);

  const cards = useMemo<FeedCard[]>(() => buildFeed(db, currentUserId, filter), [db, currentUserId, filter]);
  const setScope = useCallback((scope: FeedScope) => setFilter((f) => ({ ...f, scope })), []);
  const setSort = useCallback((sort: FeedSort) => setFilter((f) => ({ ...f, sort })), []);

  return { cards, filter, setScope, setSort };
}
