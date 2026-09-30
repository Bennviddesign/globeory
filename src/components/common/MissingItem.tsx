import { Screen } from './Screen';
import { ScreenHeader } from './ScreenHeader';
import { EmptyState } from './StateViews';

/** Shown when a route points to something that does not exist or is not visible to the viewer. */
export function MissingItem({ what = 'item' }: { what?: string }) {
  return (
    <Screen>
      <ScreenHeader title="Not available" back />
      <EmptyState
        title={`This ${what} is not available`}
        message="It may have been deleted, or it is not shared with you."
        icon="lock-closed-outline"
      />
    </Screen>
  );
}
