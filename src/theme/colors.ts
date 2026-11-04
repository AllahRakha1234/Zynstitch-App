/**
 * Brand palette mirrored from Tailor-Track MUI ThemeProvider.
 */

export const brandColors = {
  light: {
    primary: '#1565c0',
    primaryDark: '#0d47a1',
    primaryContainer: '#d0e4ff',
    onPrimaryContainer: '#001d36',
    secondary: '#009688',
    secondaryContainer: '#b2dfdb',
    onSecondaryContainer: '#00201c',
    background: '#f0eded',
    surface: '#ffffff',
    surfaceVariant: '#e7e0e0',
    text: '#212121',
    textSecondary: '#555555',
    outline: '#c4c4c4',
    error: '#b3261e',
  },
  dark: {
    primary: '#90caf9',
    primaryDark: '#64b5f6',
    primaryContainer: '#0d47a1',
    onPrimaryContainer: '#d0e4ff',
    secondary: '#4db6ac',
    secondaryContainer: '#00695c',
    onSecondaryContainer: '#b2dfdb',
    background: '#1c1c1c',
    surface: '#121212',
    surfaceVariant: '#2a2a2a',
    text: '#f5f5f5',
    textSecondary: '#aaaaaa',
    outline: '#555555',
    error: '#f2b8b5',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
