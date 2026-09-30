import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MIN_TOUCH, radii, spacing } from '@/constants/layout';
import { useColors } from '@/context/ThemeContext';
import { normalizeText } from '@/services/util/text';
import { AppText } from '../common/AppText';
import { Icon } from '../common/Icon';
import { BottomSheet } from './BottomSheet';

export interface PickerItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Extra text that is searchable but not displayed (e.g. IATA code). */
  keywords?: string;
  leading?: string;
}

interface SearchPickerSheetProps {
  visible: boolean;
  title: string;
  placeholder: string;
  items: readonly PickerItem[];
  selectedId?: string | null;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  maxResults?: number;
}

/** Searchable list in a bottom sheet (cities, airports, trips). */
export function SearchPickerSheet({
  visible,
  title,
  placeholder,
  items,
  selectedId,
  onSelect,
  onClose,
  maxResults = 40,
}: SearchPickerSheetProps) {
  const colors = useColors();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    const list = q
      ? items.filter((item) => normalizeText(`${item.title} ${item.subtitle ?? ''} ${item.keywords ?? ''}`).includes(q))
      : items;
    return list.slice(0, maxResults);
  }, [items, query, maxResults]);

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={close} title={title} maxHeightRatio={0.9}>
      <View style={[styles.search, { backgroundColor: colors.surfaceMuted }]}>
        <Icon name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          accessibilityLabel={placeholder}
        />
      </View>
      {filtered.length === 0 ? (
        <AppText tone="muted" style={styles.empty}>
          No matches
        </AppText>
      ) : (
        filtered.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setQuery('');
              onSelect(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            accessibilityState={{ selected: item.id === selectedId }}
            style={styles.row}
          >
            {item.leading ? <AppText style={{ fontSize: 22 }}>{item.leading}</AppText> : null}
            <View style={{ flex: 1 }}>
              <AppText variant="bodyLarge">{item.title}</AppText>
              {item.subtitle ? (
                <AppText variant="small" tone="muted">
                  {item.subtitle}
                </AppText>
              ) : null}
            </View>
            {item.id === selectedId ? <Icon name="checkmark" size={20} color={colors.primary} /> : null}
          </Pressable>
        ))
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    minHeight: MIN_TOUCH,
    marginBottom: spacing.sm,
  },
  input: { flex: 1, fontSize: 16, minHeight: MIN_TOUCH },
  row: { minHeight: MIN_TOUCH + 8, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  empty: { paddingVertical: spacing.xl, textAlign: 'center' },
});
