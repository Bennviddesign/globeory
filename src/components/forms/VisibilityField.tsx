import { VISIBILITY_LABELS, VISIBILITY_VALUES, type Visibility } from '@/models/common';
import { SegmentedControl } from '../common/SegmentedControl';
import { FormField } from './FormField';

const HINTS: Record<Visibility, string> = {
  public: 'Anyone can see this (if your profile is public).',
  followers: 'Only people who follow you can see this.',
  private: 'Only you can see this.',
};

export function VisibilityField({ value, onChange }: { value: Visibility; onChange: (value: Visibility) => void }) {
  return (
    <FormField label="Visibility" hint={HINTS[value]}>
      <SegmentedControl
        options={VISIBILITY_VALUES.map((v) => ({ value: v, label: VISIBILITY_LABELS[v] }))}
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
}
