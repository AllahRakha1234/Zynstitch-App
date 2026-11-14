import { mockCustomers, mockMeasurements } from '@/api/mock/data';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';

export default function MeasurementsScreen() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <CollectionTableScreen
      title="Measurements"
      singularTitle="Measurement"
      entity="measurements"
      initialData={mockMeasurements}
      fields={[
        { key: 'measurementName', label: 'Measurement name', type: 'text', required: true },
        {
          key: 'customerId',
          label: 'Customer',
          type: 'select',
          required: true,
          options: mockCustomers.map((customer) => ({ label: customer.name, value: customer._id ?? '' })),
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
        const customer = mockCustomers.find((item) => item._id === values.customerId);
        return { ...values, customerName: customer?.name ?? '', customerPhone: customer?.phone ?? '' };
      }}
    />
  );
}
