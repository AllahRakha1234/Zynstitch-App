import { useCallback } from 'react';

import { fetchJobs } from '@/api';
import { EntityListScreen } from '@/components/shared/EntityListScreen';
import { ListCard } from '@/components/shared/ListCard';
import type { ExportJob } from '@/types/jobs.types';

export default function JobsScreen() {
  const load = useCallback(async (search: string) => {
    const response = await fetchJobs(0, 50, { search });
    return {
      success: response.success,
      message: response.message,
      items: response.data?.jobs ?? [],
      total: response.data?.total ?? 0,
    };
  }, []);

  return (
    <EntityListScreen<ExportJob>
      title="Jobs"
      searchPlaceholder="Search export jobs"
      load={load}
      keyExtractor={(item) => item._id ?? item.fileName ?? item.entity}
      emptyTitle="No export jobs"
      emptyDescription="Export jobs from the backend will appear here."
      renderItem={(item) => (
        <ListCard
          title={item.fileName ?? item.entity}
          subtitle={item.entity}
          meta={item.status}
        />
      )}
    />
  );
}
