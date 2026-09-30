import { Alert } from 'react-native';

/** Native confirmation dialog for destructive actions. */
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void,
): void {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

/** Shows an error message (e.g. a validation problem) to the user. */
export function showError(message: string): void {
  Alert.alert('Something went wrong', message);
}
