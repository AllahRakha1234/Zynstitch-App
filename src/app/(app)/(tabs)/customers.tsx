import { deleteCustomer, fetchAllCustomers, saveCustomer } from '@/api';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';
import type { ICustomer } from '@/types/customer.types';

export default function CustomersScreen() {
  const loadCustomers = async (search: string) => {
    const response = await fetchAllCustomers(0, 50, search ? { search } : undefined);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.customers ?? [],
      total: response.data?.total ?? 0,
    };
  };

  return (
    <CollectionTableScreen
      title="Customers"
      singularTitle="Customer"
      entity="customers"
      initialData={[]}
      loadRows={loadCustomers}
      saveRowRemote={async (values, existing) => {
        const customer: ICustomer = {
          _id: typeof existing?._id === 'string' ? existing._id : undefined,
          name: String(values.name ?? '').trim(),
          phone: String(values.phone ?? '').trim(),
          email: String(values.email ?? '').trim(),
          address: String(values.address ?? '').trim(),
        };
        const response = await saveCustomer(customer);
        return { success: response.success, message: response.message, data: response.data };
      }}
      deleteRowRemote={async (id) => {
        const response = await deleteCustomer(id);
        return { success: response.success, message: response.message, data: response.data };
      }}
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
