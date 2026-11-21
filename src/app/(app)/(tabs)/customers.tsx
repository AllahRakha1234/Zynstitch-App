import { deleteCustomer, fetchAllCustomers, saveCustomer } from '@/api';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';
import type { ICustomer } from '@/types/customer.types';
import { IconButton } from 'react-native-paper';
import { Linking } from 'react-native';
import { getWhatsAppUrl } from '@/utils/whatsapp';

const formatPhoneNumber = (phone: string): { formatted: string; isValid: boolean } => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return { formatted: '92' + cleaned.substring(1), isValid: true };
  }
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return { formatted: cleaned, isValid: true };
  }
  return { formatted: '', isValid: false };
};

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
      renderExtraActions={(row) => {
        const phone = String(row.phone ?? '');
        const name = String(row.name ?? '');
        const url = getWhatsAppUrl(phone, name);
        if (!url) return null;
        return (
          <IconButton
            icon="whatsapp"
            size={19}
            iconColor="#25D366"
            onPress={(e: any) => {
              e.stopPropagation();
              Linking.openURL(url);
            }}
          />
        );
      }}
      saveRowRemote={async (values, existing) => {
        const { formatted, isValid } = formatPhoneNumber(String(values.phone ?? ''));
        if (!isValid) {
          return {
            success: false,
            message:
              'Invalid phone number format. Must start with 0 (11 digits) or 92 (12 digits).',
          };
        }

        const customer: ICustomer = {
          _id: typeof existing?._id === 'string' ? existing._id : undefined,
          name: String(values.name ?? '').trim(),
          phone: formatted,
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
