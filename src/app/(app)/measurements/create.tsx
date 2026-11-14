import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackArrowButton } from '@/components/shared/BackArrowButton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CreateMeasurementScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + Spacing.four }]}> 
      <View style={styles.pageTitle}>
        <BackArrowButton fallbackHref="/measurements" />
        <Text variant="headlineSmall" style={styles.title}>Create measurement</Text>
      </View>
      <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
        This form will use the same payload as Tailor-Track once the backend is connected.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontWeight: '700',
  },
});
