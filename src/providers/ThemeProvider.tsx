import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { brandColors, getPaperTheme, type ThemeMode } from '@/theme';

const STORAGE_KEY = 'themeMode';
const LANGUAGE_STORAGE_KEY = 'appLanguage';
export type AppLanguage = 'en' | 'ur';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  language: AppLanguage;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setLanguage: (language: AppLanguage) => void;
}

const ThemeModeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
}

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    systemScheme === 'dark' ? 'dark' : 'light',
  );
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [storedMode, storedLanguage] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        ]);
        if (!cancelled && (storedMode === 'light' || storedMode === 'dark')) {
          setModeState(storedMode);
        }
        if (!cancelled && (storedLanguage === 'en' || storedLanguage === 'ur')) {
          setLanguageState(storedLanguage);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {
      // Persistence is best-effort; theme still works in-memory.
    });
  }, [mode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language).catch(() => {
      // Preference persistence is best-effort; the selection still works in-memory.
    });
  }, [language, hydrated]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const paperTheme = useMemo(() => getPaperTheme(mode), [mode]);

  const navigationTheme = useMemo(() => {
    const palette = brandColors[mode];
    const base = mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

    return {
      ...base,
      dark: mode === 'dark',
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.surface,
        text: palette.text,
        border: palette.outline,
        notification: palette.secondary,
      },
    };
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      language,
      toggleTheme,
      setMode,
      setLanguage,
    }),
    [mode, language, toggleTheme, setMode, setLanguage],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>
        <NavigationThemeProvider value={navigationTheme}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          {children}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeModeContext.Provider>
  );
}
