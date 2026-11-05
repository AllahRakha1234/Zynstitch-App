import { Link } from 'expo-router';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreen({ title, description, children, footer }: Props) {
  const colors = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Link href="/" style={[styles.brand, { color: colors.primary }]}>
            Zynstitch
          </Link>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <Text variant="headlineSmall" style={styles.title}>
              {title}
            </Text>
            {description ? (
              <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                {description}
              </Text>
            ) : null}
            {children}
            {footer}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  brand: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
