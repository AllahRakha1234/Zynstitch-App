import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { fetchMeasurementById } from '@/api';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { IMeasurement } from '@/types/measurements.types';

export default function MeasurementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
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
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineSmall">{measurement.measurementName}</Text>
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
});
