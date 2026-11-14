import { mockCustomers } from '@/api/mock/data';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';

export default function CustomersScreen() {
  return (
    <CollectionTableScreen
      title="Customers"
      singularTitle="Customer"
      entity="customers"
      initialData={mockCustomers}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'phone', label: 'Phone', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'address', label: 'Address', type: 'text', required: true },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address' },
      ]}
    />
  );
}
