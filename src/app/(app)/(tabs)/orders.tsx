import { useEffect, useState } from 'react';
import { deleteOrder, fetchAllCustomers, fetchAllMeasurements, fetchAllOrders, saveOrder } from '@/api';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';
import type { IOrder } from '@/types/orders.types';
import type { ICustomer } from '@/types/customer.types';

const defaultOrderDate = new Date().toISOString().slice(0, 10);
const defaultDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function OrdersScreen() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [measurements, setMeasurements] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [custResp, measResp] = await Promise.all([
        fetchAllCustomers(0, 100),
        fetchAllMeasurements(0, 100),
      ]);

      if (custResp.success && custResp.data) {
        setCustomers(custResp.data.customers);
      }
      if (measResp.success && measResp.data) {
        setMeasurements(measResp.data.measurements.map((m) => ({ label: m.measurementName, value: m._id ?? '' })));
      }
    })();
  }, []);

  const loadOrders = async (search: string) => {
    const response = await fetchAllOrders(0, 50, search ? { search } : undefined);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.orders ?? [],
      total: response.data?.total ?? 0,
    };
  };

  return (
    <CollectionTableScreen
      title="Orders"
      singularTitle="Order"
      entity="orders"
      initialData={[]}
      loadRows={loadOrders}
      saveRowRemote={async (values, existing) => {
        const order: IOrder = {
          ...values,
          _id: typeof existing?._id === 'string' ? existing._id : undefined,
          customerId: String(values.customerId ?? ''),
          measurementId: values.measurementId ? String(values.measurementId) : null,
          orderNumber: String(values.orderNumber ?? '').trim(),
          price: Number(values.price || 0),
          advancePaid: Number(values.advancePaid || 0),
          status: String(values.status || 'pending') as any,
          orderDate: String(values.orderDate || defaultOrderDate),
          dueDate: String(values.dueDate || defaultDueDate),
        };
        const response = await saveOrder(order);
        return { success: response.success, message: response.message, data: response.data };
      }}
      deleteRowRemote={async (id) => {
        const response = await deleteOrder(id);
        return { success: response.success, message: response.message, data: response.data };
      }}
      fields={[
        { key: 'orderNumber', label: 'Order number', type: 'text', required: true },
        {
          key: 'customerId',
          label: 'Customer',
          type: 'select',
          required: true,
          options: customers.map(c => ({ label: c.name, value: c._id ?? '' })),
        },
        {
          key: 'measurementId',
          label: 'Measurement (Optional)',
          type: 'select',
          options: measurements,
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
        const customer = customers.find((item) => item._id === values.customerId);
        return {
          ...values,
          customerName: customer?.name ?? '',
          customerPhone: customer?.phone ?? '',
        };
      }}
    />
  );
}

