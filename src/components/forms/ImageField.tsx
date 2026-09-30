import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { radii, spacing } from '@/constants/layout';
import { pickRepresentativeImage } from '@/services/images/imageService';
import { AppText } from '../common/AppText';
import { Button } from '../common/Button';
import { DestinationImage } from '../common/DestinationImage';
import { showError } from '../modals/confirm';
import { FormField } from './FormField';

interface ImageFieldProps {
  /** The single representative image (or `null`). */
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
}

/**
 * The ONE representative image of a destination visit (spec sections 13, 15, 41).
 * - picks from the device library only (no camera button exists),
 * - choosing again REPLACES the image, never adds a second one,
 * - the image can be removed.
 */
export function ImageField({ value, onChange, label = 'Representative image' }: ImageFieldProps) {
  const [busy, setBusy] = useState(false);

  const choose = async () => {
    try {
      setBusy(true);
      const picked = await pickRepresentativeImage();
      if (picked) onChange(picked);
    } catch {
      showError('The image could not be loaded. Please try another photo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormField label={label} hint="Optional. One image per visit, chosen from your existing photos.">
      <DestinationImage path={value} size="medium" style={styles.preview} accessibilityLabel="Selected image" />
      <View style={styles.actions}>
        <View style={{ flex: 1 }}>
          <Button
            label={value ? 'Replace image' : 'Choose from library'}
            icon="images-outline"
            variant="secondary"
            loading={busy}
            onPress={choose}
          />
        </View>
        {value ? (
          <View>
            <Button label="Remove" variant="danger" fullWidth={false} onPress={() => onChange(null)} />
          </View>
        ) : null}
      </View>
      {!value ? (
        <AppText variant="caption" tone="muted">
          Globeory never opens the camera.
        </AppText>
      ) : null}
    </FormField>
  );
}

const styles = StyleSheet.create({
  preview: { height: 180, borderRadius: radii.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
});
