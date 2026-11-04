/**
 * Returns the current palette tokens for the active theme mode.
 * Prefer `useTheme` from `react-native-paper` for MD3 component colors.
 */

import { Colors } from '@/constants/theme';
import { useThemeMode } from '@/providers/ThemeProvider';

export function useTheme() {
  const { mode } = useThemeMode();
  return Colors[mode];
}
