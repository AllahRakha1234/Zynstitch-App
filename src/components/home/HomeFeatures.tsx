import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const features = [
  {
    title: 'Centralized Customer Profiles',
    description:
      "Keep every client's contact details, notes, and tailoring preferences organized in one place.",
    icon: 'account-group-outline' as const,
  },
  {
    title: 'Tailoring Workflow in One Dashboard',
    description:
      'Manage customer intake, order stages, stitching, and delivery from a single control center.',
    icon: 'view-dashboard-outline' as const,
  },
  {
    title: 'Reusable Measurement Records',
    description:
      'Store and update body profiles so repeat customers get fast, accurate fittings every time.',
    icon: 'clipboard-check-outline' as const,
  },
  {
    title: 'Clear Order Progress Tracking',
    description: 'See order status from intake to handover, with each stage visible and easy to follow.',
    icon: 'clock-outline' as const,
  },
  {
    title: 'Seamless Data Export',
    description:
      'Export customer data, orders, and measurements for backup, analysis, or integration with other tools.',
    icon: 'file-download-outline' as const,
  },
];

export function HomeFeatures() {
  const colors = useTheme();

  return (
    <View style={styles.section}>
      <Text variant="headlineSmall" style={styles.title}>
        Features Built for Modern Tailors
      </Text>
      <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.textSecondary }]}>
        Streamline your tailoring business with powerful tools designed for efficiency and customer
        satisfaction.
      </Text>

      <View style={styles.grid}>
        {features.map((feature) => (
          <View
            key={feature.title}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.outline },
            ]}
          >
            <MaterialCommunityIcons name={feature.icon} size={28} color={colors.primary} />
            <Text variant="titleMedium" style={styles.cardTitle}>
              {feature.title}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.two,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginBottom: Spacing.two,
    lineHeight: 22,
  },
  grid: {
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    gap: Spacing.two,
  },
  cardTitle: {
    marginTop: Spacing.one,
  },
});
