import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

import { brandColors, type ThemeMode } from '@/theme/colors';
import { paperFonts } from '@/theme/fonts';

/**
 * Paper MD3 button radius = roundness * 5.
 * Use 1.6 so buttons match Tailor-Track MUI `borderRadius: 8`.
 */
const ROUNDNESS = 1.6;

const lightColors = brandColors.light;
const darkColors = brandColors.dark;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  roundness: ROUNDNESS,
  fonts: paperFonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.primary,
    onPrimary: '#ffffff',
    primaryContainer: lightColors.primaryContainer,
    onPrimaryContainer: lightColors.onPrimaryContainer,
    secondary: lightColors.secondary,
    onSecondary: '#ffffff',
    secondaryContainer: lightColors.secondaryContainer,
    onSecondaryContainer: lightColors.onSecondaryContainer,
    tertiary: lightColors.secondary,
    onTertiary: '#ffffff',
    tertiaryContainer: lightColors.secondaryContainer,
    onTertiaryContainer: lightColors.onSecondaryContainer,
    background: lightColors.background,
    onBackground: lightColors.text,
    surface: lightColors.surface,
    onSurface: lightColors.text,
    surfaceVariant: lightColors.surfaceVariant,
    onSurfaceVariant: lightColors.textSecondary,
    outline: lightColors.outline,
    outlineVariant: '#d9d9d9',
    error: lightColors.error,
    onError: '#ffffff',
    errorContainer: '#f9dedc',
    onErrorContainer: '#410e0b',
    inverseSurface: darkColors.surface,
    inverseOnSurface: darkColors.text,
    inversePrimary: darkColors.primary,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: lightColors.surface,
      level2: '#f7f5f5',
      level3: '#f3f0f0',
      level4: '#f1eeee',
      level5: '#efecec',
    },
    surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
    onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',
    backdrop: 'rgba(33, 33, 33, 0.4)',
    shadow: '#000000',
    scrim: '#000000',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: ROUNDNESS,
  fonts: paperFonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary,
    onPrimary: '#003258',
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    secondary: darkColors.secondary,
    onSecondary: '#003731',
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,
    tertiary: darkColors.secondary,
    onTertiary: '#003731',
    tertiaryContainer: darkColors.secondaryContainer,
    onTertiaryContainer: darkColors.onSecondaryContainer,
    background: darkColors.background,
    onBackground: darkColors.text,
    surface: darkColors.surface,
    onSurface: darkColors.text,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.textSecondary,
    outline: darkColors.outline,
    outlineVariant: '#3d3d3d',
    error: darkColors.error,
    onError: '#601410',
    errorContainer: '#8c1d18',
    onErrorContainer: '#f9dedc',
    inverseSurface: lightColors.surface,
    inverseOnSurface: lightColors.text,
    inversePrimary: lightColors.primary,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: '#232323',
      level2: '#282828',
      level3: '#2d2d2d',
      level4: '#2f2f2f',
      level5: '#333333',
    },
    surfaceDisabled: 'rgba(245, 245, 245, 0.12)',
    onSurfaceDisabled: 'rgba(245, 245, 245, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
    scrim: '#000000',
  },
};

export function getPaperTheme(mode: ThemeMode): MD3Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
