import { mockUsers } from '@/api/mock/data';
import { CollectionTableScreen } from '@/components/shared/CollectionTableScreen';

export default function UsersScreen() {
  return (
    <CollectionTableScreen
      title="Users"
      singularTitle="User"
      entity="users"
      initialData={mockUsers}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'password', label: 'Password', type: 'password', required: true, hideOnEdit: true },
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          defaultValue: 'ADMIN',
          options: [
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Super admin', value: 'SUPER_ADMIN' },
          ],
        },
        { key: 'companyName', label: 'Company', type: 'text' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'ACTIVE',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Blocked', value: 'BLOCKED' },
          ],
        },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email', width: 200 },
        { key: 'role', label: 'Role' },
        { key: 'companyName', label: 'Company' },
        { key: 'status', label: 'Status' },
      ]}
      canExport={false}
    />
  );
}
