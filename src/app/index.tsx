import { Redirect } from 'expo-router';
import { useSession } from '@/context/SessionContext';

/** Entry point: signed-in users (demo or local) go to Explore, everyone else to onboarding. */
export default function Index() {
  const { namespace } = useSession();
  return <Redirect href={namespace ? '/explore' : '/onboarding'} />;
}
