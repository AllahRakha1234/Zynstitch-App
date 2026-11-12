import { useCallback } from 'react';

import { fetchAllOrders } from '@/api';
import { EntityListScreen } from '@/components/shared/EntityListScreen';
import { ListCard } from '@/components/shared/ListCard';
import type { IOrder } from '@/types/orders.types';

export default function OrdersScreen() {
  const load = useCallback(async (filters: Record<string, string>) => {
    const response = await fetchAllOrders(0, 50, filters);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.orders ?? [],
      total: response.data?.total ?? 0,
    };
  }, []);

  return (
    <EntityListScreen<IOrder>
      title="Orders"
      filters={[
        { key: 'search', label: 'Search', type: 'text', placeholder: 'Search orders' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'All statuses', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Delivered', value: 'delivered' },
          ],
        },
      ]}
      topSafeArea
      load={load}
      keyExtractor={(item) => item._id ?? item.orderNumber ?? item.customerId}
      emptyTitle="No orders yet"
      emptyDescription="Orders from the backend will appear here."
      renderItem={(item) => (
        <ListCard
          title={item.orderNumber ?? 'Order'}
          subtitle={item.customerName ?? item.customerId}
          meta={`${item.status.replace('_', ' ')} · PKR ${item.price}`}
        />
      )}
    />
  );
}
