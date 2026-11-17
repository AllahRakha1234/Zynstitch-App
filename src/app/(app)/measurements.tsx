import { deleteMeasurement, fetchAllCustomers, fetchAllMeasurements, saveMeasurement } from '@/api';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';
import type { ICustomer } from '@/types/customer.types';
import type { IMeasurement } from '@/types/measurements.types';
import { useEffect, useState } from 'react';

export default function MeasurementsScreen() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const response = await fetchAllCustomers(0, 100);
      if (response.success && response.data) {
        setCustomers(response.data.customers);
      }
    })();
  }, []);

  const loadMeasurements = async (search: string) => {
    const response = await fetchAllMeasurements(0, 50, search ? { search } : undefined);
    return {
      success: response.success,
      message: response.message,
      items: response.data?.measurements ?? [],
      total: response.data?.total ?? 0,
    };
  };

  return (
    <CollectionTableScreen
      title="Measurements"
      singularTitle="Measurement"
      entity="measurements"
      initialData={[]}
      loadRows={loadMeasurements}
      saveRowRemote={async (values, existing) => {
        const measurement: IMeasurement = {
          ...values,
          _id: typeof existing?._id === 'string' ? existing._id : undefined,
          customerId: String(values.customerId ?? ''),
          measurementName: String(values.measurementName ?? '').trim(),
        };
        const response = await saveMeasurement(measurement);
        return { success: response.success, message: response.message, data: response.data };
      }}
      deleteRowRemote={async (id) => {
        const response = await deleteMeasurement(id);
        return { success: response.success, message: response.message, data: response.data };
      }}
      fields={[
        { key: 'measurementName', label: 'Measurement name', type: 'text', required: true },
        {
          key: 'customerId',
          label: 'Customer',
          type: 'select',
          required: true,
          options: customers.map(c => ({ label: c.name, value: c._id ?? '' })),
        },
        { key: 'measurementDate', label: 'Measurement date', type: 'date', defaultValue: today },
        ...[
          ['kameezLength', 'Kameez length'],
          ['sleeveLength', 'Sleeve length'],
          ['shoulderWidth', 'Shoulder width'],
          ['neck', 'Neck'],
          ['chest', 'Chest'],
          ['waist', 'Waist'],
          ['bottomWidth', 'Bottom width'],
          ['shalwarLength', 'Shalwar length'],
          ['bottomOpening', 'Bottom opening'],
          ['cuff', 'Cuff'],
        ].map(([key, label]) => ({ key, label, type: 'number' as const })),
        {
          key: 'collarStyle',
          label: 'Collar style',
          type: 'select',
          options: [
            { label: 'No collar', value: 'noCollar' },
            { label: 'Collar', value: 'collar' },
            { label: 'Ban', value: 'ban' },
            { label: 'Other', value: 'other' },
          ],
        },
        { key: 'hasChakPattiKaaj', label: 'Chak patti kaaj', type: 'toggle' },
        { key: 'hasChestPocket', label: 'Chest pocket', type: 'toggle' },
        { key: 'hasSidePockets', label: 'Side pockets', type: 'toggle' },
        { key: 'hasShalwarPocket', label: 'Shalwar pocket', type: 'toggle' },
        { key: 'notes', label: 'Notes', type: 'text' },
      ]}
      columns={[
        { key: 'measurementName', label: 'Measurement', width: 180 },
        { key: 'customerName', label: 'Customer', width: 150 },
        { key: 'customerPhone', label: 'Phone', width: 140 },
        { key: 'measurementDate', label: 'Date', width: 130 },
        { key: 'chest', label: 'Chest', width: 100 },
        { key: 'waist', label: 'Waist', width: 100 },
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
