import { useRouter } from 'expo-router';
import { AddMenuSheet, type AddKind } from '@/components/modals/AddMenuSheet';

/** The centre "+" button: Add menu as a bottom sheet over the current screen. */
export default function AddScreen() {
  const router = useRouter();
  return (
    <AddMenuSheet
      visible
      onClose={() => router.back()}
      onSelect={(kind: AddKind) => router.replace(`/form/${kind}`)}
    />
  );
}
