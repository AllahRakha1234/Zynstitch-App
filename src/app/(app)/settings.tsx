import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, SegmentedButtons, Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemeMode } from '@/providers/ThemeProvider';

export default function SettingsScreen() {
  const colors = useTheme();
  const { mode, setMode, language, setLanguage } = useThemeMode();

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineSmall" style={styles.title}>Settings</Text>
      <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
        Personalize your Zynstitch experience.
      </Text>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Appearance</Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          Choose the theme used throughout the app.
        </Text>
        <SegmentedButtons
          value={mode}
          onValueChange={(value) => setMode(value as 'light' | 'dark')}
          buttons={[
            { value: 'light', label: 'Light', icon: 'white-balance-sunny' },
            { value: 'dark', label: 'Dark', icon: 'moon-waning-crescent' },
          ]}
        />

        <Divider style={styles.divider} />
        <Text variant="titleMedium">Language</Text>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
          Select your preferred language.
        </Text>
        <SegmentedButtons
          value={language}
          onValueChange={(value) => setLanguage(value as 'en' | 'ur')}
          buttons={[
            { value: 'en', label: 'English' },
            { value: 'ur', label: 'اردو' },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: Spacing.four, paddingTop: Spacing.five, paddingBottom: Spacing.six, gap: Spacing.three },
  title: { fontWeight: '700' },
  section: { padding: Spacing.three, gap: Spacing.two, borderRadius: 16, borderWidth: 1, marginTop: Spacing.two },
  sectionTitle: { fontWeight: '700' },
  divider: { marginVertical: Spacing.two },
});
