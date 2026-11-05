import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function HomeFooter() {
  const colors = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.outline }]}>
      <Text variant="titleLarge" style={[styles.brand, { color: colors.primary }]}>
        Zynstitch
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
        The tailoring operations platform for customer records, measurements, and delivery
        management.
      </Text>
      <Text variant="titleSmall" style={styles.contactTitle}>
        Contact
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
        Email: arzhsp1234@gmail.com
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
        Phone: +92 326 5169107
      </Text>
      <View style={[styles.bottom, { borderTopColor: colors.outline }]}>
        <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
          © 2026 Zynstitch. Tailoring operations platform for modern businesses.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    borderTopWidth: 1,
    gap: Spacing.one,
  },
  brand: {
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  contactTitle: {
    marginTop: Spacing.three,
    fontWeight: '600',
  },
  bottom: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
});
