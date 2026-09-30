import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { showError } from '../modals/confirm';

/**
 * Runs a save handler, shows validation errors from the services as an alert
 * and closes the form on success.
 */
export function useFormSubmit() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  const submit = useCallback(
    (action: () => void | { href: string }) => {
      try {
        setSaving(true);
        const result = action();
        if (result && typeof result === 'object' && 'href' in result) router.replace(result.href as never);
        else close();
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Please check the form and try again.');
      } finally {
        setSaving(false);
      }
    },
    [router, close],
  );

  return { submit, saving, close };
}
