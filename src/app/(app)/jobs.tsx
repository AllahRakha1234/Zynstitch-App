import { mockJobs } from '@/api/mock/data';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';

export default function JobsScreen() {
  return (
    <CollectionTableScreen
      title="Jobs"
      singularTitle="Job"
      entity="jobs"
      initialData={mockJobs}
      fields={[]}
      columns={[
        { key: 'entity', label: 'Entity' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created at', width: 200 },
        { key: 'fileName', label: 'File name', width: 220 },
      ]}
      canAdd={false}
      canExport={false}
      canEdit={false}
    />
  );
}
