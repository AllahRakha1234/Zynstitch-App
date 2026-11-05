import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CreateMeasurementScreen() {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="titleMedium">Create measurement</Text>
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
});
