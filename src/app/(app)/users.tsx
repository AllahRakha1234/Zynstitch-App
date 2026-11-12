import { useCallback } from 'react';

import { fetchAllAdminUsers } from '@/api';
import { EntityListScreen } from '@/components/shared/EntityListScreen';
import { ListCard } from '@/components/shared/ListCard';
import type { IUser } from '@/types/users.types';

export default function UsersScreen() {
  const load = useCallback(async (filters: Record<string, string>) => {
    const response = await fetchAllAdminUsers(0, 50, filters);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.users ?? [],
      total: response.data?.total ?? 0,
    };
  }, []);

  return (
    <EntityListScreen<IUser>
      title="Users"
      filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search users' }]}
      load={load}
      keyExtractor={(item) => item._id ?? item.email}
      emptyTitle="No users"
      emptyDescription="Admin users from the backend will appear here."
      renderItem={(item) => (
        <ListCard
          title={item.name}
          subtitle={item.email}
          meta={`${item.role} · ${item.status}`}
        />
      )}
    />
  );
}
