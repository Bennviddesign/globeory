import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/layout';
import { IconButton } from '../common/IconButton';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  label: string;
}

/** Accessible zoom controls for the globe and the map (spec section 47). */
export function MapControls({ onZoomIn, onZoomOut, onReset, label }: MapControlsProps) {
  return (
    <View style={styles.container} accessibilityLabel={`${label} controls`}>
      <IconButton icon="add" accessibilityLabel={`Zoom in ${label}`} onPress={onZoomIn} filled />
      <IconButton icon="remove" accessibilityLabel={`Zoom out ${label}`} onPress={onZoomOut} filled />
      <IconButton icon="locate" accessibilityLabel={`Reset ${label} view`} onPress={onReset} filled />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', right: spacing.sm, bottom: spacing.sm, gap: spacing.xs },
});
