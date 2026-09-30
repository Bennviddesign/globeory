import { useMemo } from 'react';
import type { DistanceUnit, ID } from '@/models/common';
import type { Database } from '@/models/database';
import { scopeToUser } from '@/services/social/visibilityService';
import { computeStats, type TravelStats } from '@/services/stats/statsService';
import { useData } from './DataContext';

/** The viewer's preferred distance unit (km by default). */
export function useUnit(): DistanceUnit {
  return useData().currentUser?.preferred_unit ?? 'km';
}

/**
 * The data of `ownerId` filtered to what the signed-in viewer is authorized to
 * see. Own data is returned completely; other people's data only contains
 * rows the viewer may see. Use this for every profile/globe/timeline view.
 */
export function useScopedDb(ownerId: ID | null | undefined): Database {
  const { db, currentUserId } = useData();
  return useMemo(
    () => scopeToUser(db, ownerId ?? '', currentUserId),
    [db, ownerId, currentUserId],
  );
}

export function useStats(ownerId: ID | null | undefined): TravelStats {
  const scoped = useScopedDb(ownerId);
  return useMemo(() => computeStats(scoped, ownerId ?? ''), [scoped, ownerId]);
}
