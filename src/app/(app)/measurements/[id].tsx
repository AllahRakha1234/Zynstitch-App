import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchMeasurementById } from '@/api';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { BackArrowButton } from '@/components/shared/BackArrowButton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { IMeasurement } from '@/types/measurements.types';

export default function MeasurementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const [measurement, setMeasurement] = useState<IMeasurement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetchMeasurementById(id);
      setMeasurement(response.data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!measurement) {
    return <EmptyState title="Measurement not found" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.two }]}
    >
      <View style={styles.pageTitle}>
        <BackArrowButton fallbackHref="/measurements" />
        <Text variant="headlineSmall" style={styles.title}>Measurement details</Text>
      </View>
      <Text variant="titleMedium">{measurement.measurementName}</Text>
      <Text variant="bodyMedium">{measurement.customerName}</Text>
      <Text variant="bodyMedium">Chest: {measurement.chest ?? '—'}</Text>
      <Text variant="bodyMedium">Waist: {measurement.waist ?? '—'}</Text>
      <Text variant="bodyMedium">Kameez: {measurement.kameezLength ?? '—'}</Text>
      {measurement.notes ? <Text variant="bodyMedium">{measurement.notes}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  title: {
    fontWeight: '700',
  },
});
