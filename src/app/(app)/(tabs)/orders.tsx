import { mockCustomers, mockOrders } from '@/api/mock/data';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';

const defaultOrderDate = new Date().toISOString().slice(0, 10);
const defaultDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function OrdersScreen() {
  return (
    <CollectionTableScreen
      title="Orders"
      singularTitle="Order"
      entity="orders"
      initialData={mockOrders}
      fields={[
        { key: 'orderNumber', label: 'Order number', type: 'text', defaultValue: `ORD-${1000 + mockOrders.length + 1}`, hideOnEdit: true },
        {
          key: 'customerId',
          label: 'Customer',
          type: 'select',
          required: true,
          options: mockCustomers.map((customer) => ({ label: customer.name, value: customer._id ?? '' })),
        },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Delivered', value: 'delivered' },
          ],
        },
        { key: 'price', label: 'Price', type: 'number', required: true },
        { key: 'advancePaid', label: 'Advance paid', type: 'number', required: true, defaultValue: '0' },
        { key: 'orderDate', label: 'Order date', type: 'date', required: true, defaultValue: defaultOrderDate },
        { key: 'dueDate', label: 'Due date', type: 'date', required: true, defaultValue: defaultDueDate },
        { key: 'notes', label: 'Notes', type: 'text' },
      ]}
      columns={[
        { key: 'orderNumber', label: 'Order number', width: 140 },
        { key: 'customerName', label: 'Customer', width: 150 },
        { key: 'customerPhone', label: 'Phone', width: 140 },
        { key: 'price', label: 'Price', width: 100 },
        { key: 'advancePaid', label: 'Advance', width: 110 },
        { key: 'status', label: 'Status', width: 125 },
        { key: 'orderDate', label: 'Order date', width: 130 },
        { key: 'dueDate', label: 'Due date', width: 130 },
        { key: 'notes', label: 'Notes', width: 180 },
      ]}
      prepareRow={(values) => {
        const customer = mockCustomers.find((item) => item._id === values.customerId);
        return {
          ...values,
          customerName: customer?.name ?? '',
          customerPhone: customer?.phone ?? '',
        };
      }}
    />
  );
}
