import { useCallback } from 'react';

import { fetchAllCustomers } from '@/api';
import { EntityListScreen } from '@/components/shared/EntityListScreen';
import { ListCard } from '@/components/shared/ListCard';
import type { ICustomer } from '@/types/customer.types';

export default function CustomersScreen() {
  const load = useCallback(async (filters: Record<string, string>) => {
    const response = await fetchAllCustomers(0, 50, filters);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.customers ?? [],
      total: response.data?.total ?? 0,
    };
  }, []);

  return (
    <EntityListScreen<ICustomer>
      title="Customers"
      filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search customers' }]}
      topSafeArea
      load={load}
      keyExtractor={(item) => item._id ?? item.phone}
      emptyTitle="No customers yet"
      emptyDescription="Customer records from the backend will appear here."
      renderItem={(item) => (
        <ListCard
          title={item.name}
          subtitle={`${item.phone}${item.email ? ` · ${item.email}` : ''}`}
          meta={item.address}
        />
      )}
    />
  );
}
