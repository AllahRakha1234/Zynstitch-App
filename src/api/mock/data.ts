import type { ICustomer } from '@/types/customer.types';
import type { ExportJob } from '@/types/jobs.types';
import type { IMeasurement } from '@/types/measurements.types';
import type { IOrder } from '@/types/orders.types';
import type { IUser, IUserProfile } from '@/types/users.types';

export const MOCK_PASSWORD = 'password';

export const mockProfile: IUserProfile = {
  id: 'user-1',
  name: 'Demo Admin',
  email: 'admin@zynstitch.com',
  companyName: 'Zynstitch Tailors',
  profilePhoto: '',
  role: 'SUPER_ADMIN',
};

export const mockUsers: IUser[] = [
  {
    _id: 'user-1',
    name: 'Demo Admin',
    email: 'admin@zynstitch.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    companyName: 'Zynstitch Tailors',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'user-2',
    name: 'Shop Manager',
    email: 'manager@zynstitch.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    companyName: 'Zynstitch Tailors',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const mockCustomers: ICustomer[] = [
  {
    _id: 'cust-1',
    ownerId: 'user-1',
    name: 'Ali Khan',
    phone: '+92-300-1111111',
    email: 'ali@example.com',
    address: 'Lahore',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: 'cust-2',
    ownerId: 'user-1',
    name: 'Sara Ahmed',
    phone: '+92-300-2222222',
    email: 'sara@example.com',
    address: 'Karachi',
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z',
  },
];

export const mockMeasurements: IMeasurement[] = [
  {
    _id: 'meas-1',
    ownerId: 'user-1',
    customerId: 'cust-1',
    customerName: 'Ali Khan',
    customerPhone: '+92-300-1111111',
    measurementName: 'Summer Shalwar Kameez',
    measurementDate: '2026-02-10',
    kameezLength: 42,
    sleeveLength: 24,
    shoulderWidth: 17,
    neck: 15,
    chest: 40,
    waist: 36,
    shalwarLength: 40,
    collarStyle: 'Ban',
    hasChestPocket: true,
    hasSidePockets: true,
    notes: 'Loose fit',
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },
];

export const mockOrders: IOrder[] = [
  {
    _id: 'ord-1',
    ownerId: 'user-1',
    customerId: 'cust-1',
    customerName: 'Ali Khan',
    customerPhone: '+92-300-1111111',
    measurementId: 'meas-1',
    orderNumber: 'ORD-1001',
    price: 4500,
    advancePaid: 1500,
    status: 'in_progress',
    orderDate: '2026-02-12',
    dueDate: '2026-02-20',
    notes: 'Urgent',
    createdAt: '2026-02-12T00:00:00.000Z',
    updatedAt: '2026-02-12T00:00:00.000Z',
  },
];

export const mockJobs: ExportJob[] = [
  {
    _id: 'job-1',
    ownerId: 'user-1',
    entity: 'customers',
    status: 'COMPLETED',
    fileName: 'customers_2026-02-01.xlsx',
    fileKey: 'exports/customers_2026-02-01.xlsx',
    createdAt: '2026-02-01T00:00:00.000Z',
    completedAt: '2026-02-01T00:01:00.000Z',
  },
  {
    _id: 'job-2',
    ownerId: 'user-1',
    entity: 'orders',
    status: 'PROCESSING',
    fileName: 'orders_2026-03-01.xlsx',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];
