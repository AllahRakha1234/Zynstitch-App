/**
 * App design tokens. Colors mirror Tailor-Track MUI theme;
 * component theming is provided by React Native Paper (see `@/theme`).
 */

import '@/global.css';

import { Platform } from 'react-native';

import { brandColors } from '@/theme/colors';
import { FontFamily } from '@/theme/fonts';

export const Colors = {
  light: {
    text: brandColors.light.text,
    textSecondary: brandColors.light.textSecondary,
    background: brandColors.light.background,
    backgroundElement: brandColors.light.surfaceVariant,
    backgroundSelected: brandColors.light.primaryContainer,
    primary: brandColors.light.primary,
    secondary: brandColors.light.secondary,
    surface: brandColors.light.surface,
    outline: brandColors.light.outline,
  },
  dark: {
    text: brandColors.dark.text,
    textSecondary: brandColors.dark.textSecondary,
    background: brandColors.dark.background,
    backgroundElement: brandColors.dark.surfaceVariant,
    backgroundSelected: brandColors.dark.primaryContainer,
    primary: brandColors.dark.primary,
    secondary: brandColors.dark.secondary,
    surface: brandColors.dark.surface,
    outline: brandColors.dark.outline,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.regular,
    serif: 'ui-serif',
    rounded: FontFamily.regular,
    mono: 'ui-monospace',
  },
  default: {
    sans: FontFamily.regular,
    serif: 'serif',
    rounded: FontFamily.regular,
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
