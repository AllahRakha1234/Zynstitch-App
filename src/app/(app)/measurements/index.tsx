import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { fetchAllMeasurements } from '@/api';
import { EntityListScreen } from '@/components/shared/EntityListScreen';
import { ListCard } from '@/components/shared/ListCard';
import type { IMeasurement } from '@/types/measurements.types';

export default function MeasurementsScreen() {
  const router = useRouter();
  const load = useCallback(async (filters: Record<string, string>) => {
    const response = await fetchAllMeasurements(0, 50, filters);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.measurements ?? [],
      total: response.data?.total ?? 0,
    };
  }, []);

  return (
    <EntityListScreen<IMeasurement>
      title="Measurements"
      filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search measurements' }]}
      topSafeArea
      load={load}
      keyExtractor={(item) => item._id ?? item.measurementName}
      emptyTitle="No measurements yet"
      emptyDescription="Measurement records from the backend will appear here."
      renderItem={(item) => (
        <ListCard
          title={item.measurementName}
          subtitle={item.customerName ?? item.customerId}
          meta={item.measurementDate}
          onPress={() => {
            if (item._id) router.push(`/measurements/${item._id}`);
          }}
        />
      )}
    />
  );
}
