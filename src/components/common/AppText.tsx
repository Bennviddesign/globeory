import { Text, type TextProps, type TextStyle } from 'react-native';
import { fontSizes } from '@/constants/layout';
import type { ThemeColors } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';

export type TextVariant = 'display' | 'headline' | 'title' | 'bodyLarge' | 'body' | 'small' | 'caption' | 'label';
export type TextTone = 'default' | 'secondary' | 'muted' | 'primary' | 'onPrimary' | 'danger' | 'success';

const VARIANT_STYLES: Record<TextVariant, TextStyle> = {
  display: { fontSize: fontSizes.display, fontWeight: '800', letterSpacing: -0.5 },
  headline: { fontSize: fontSizes.headline, fontWeight: '700', letterSpacing: -0.3 },
  title: { fontSize: fontSizes.title, fontWeight: '700' },
  bodyLarge: { fontSize: fontSizes.bodyLarge, fontWeight: '600' },
  body: { fontSize: fontSizes.body, fontWeight: '400', lineHeight: 21 },
  small: { fontSize: fontSizes.small, fontWeight: '400' },
  caption: { fontSize: fontSizes.caption, fontWeight: '500' },
  label: { fontSize: fontSizes.small, fontWeight: '600' },
};

const toneColor = (colors: ThemeColors, tone: TextTone): string => {
  switch (tone) {
    case 'secondary':
      return colors.textSecondary;
    case 'muted':
      return colors.textMuted;
    case 'primary':
      return colors.primary;
    case 'onPrimary':
      return colors.onPrimary;
    case 'danger':
      return colors.danger;
    case 'success':
      return colors.success;
    default:
      return colors.text;
  }
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
}

/** Themed text. Supports dynamic font sizing (accessibility) out of the box. */
export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const colors = useColors();
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[VARIANT_STYLES[variant], { color: toneColor(colors, tone) }, style]}
    />
  );
}
