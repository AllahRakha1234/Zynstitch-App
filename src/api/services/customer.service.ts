import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockCustomers } from '@/api/mock/data';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type { CustomerResponse, ICustomer } from '@/types/customer.types';

export async function fetchAllCustomers(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<CustomerResponse<{ customers: ICustomer[]; total: number }>> {
  if (env.useMockApi) {
    await mockDelay();
    const search = filters?.search?.toLowerCase().trim();
    let customers = [...mockCustomers];
    if (search) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          c.address.toLowerCase().includes(search),
      );
    }
    const total = customers.length;
    const sliced =
      limit > 0 ? customers.slice(page * limit, page * limit + limit) : customers;
    return {
      success: true,
      data: { customers: sliced, total },
      message: 'serviceMessages.fetchSuccess',
    };
  }

  try {
    const { data } = await apiClient.get<
      CustomerResponse<{ customers: ICustomer[]; total: number }>
    >(endpoints.customers.list, { params: { page, limit, ...filters } });
    return data;
  } catch (error) {
    return {
      success: false,
      data: { customers: [], total: 0 },
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}

export async function saveCustomer(
  customer: ICustomer,
): Promise<CustomerResponse<ICustomer>> {
  if (env.useMockApi) {
    await mockDelay();
    const now = new Date().toISOString();
    if (customer._id) {
      const index = mockCustomers.findIndex((c) => c._id === customer._id);
      if (index >= 0) {
        mockCustomers[index] = { ...mockCustomers[index], ...customer, updatedAt: now };
        return {
          success: true,
          data: mockCustomers[index],
          message: 'serviceMessages.updateSuccess',
        };
      }
    }
    const created: ICustomer = {
      ...customer,
      _id: `cust-${Date.now()}`,
      ownerId: 'user-1',
      createdAt: now,
      updatedAt: now,
    };
    mockCustomers.unshift(created);
    return {
      success: true,
      data: created,
      message: 'serviceMessages.createSuccess',
    };
  }

  try {
    const { data } = await apiClient.post<CustomerResponse<ICustomer>>(
      endpoints.customers.list,
      customer,
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.saveFail'),
    };
  }
}

export async function deleteCustomer(id: string): Promise<CustomerResponse<null>> {
  if (env.useMockApi) {
    await mockDelay();
    const index = mockCustomers.findIndex((c) => c._id === id);
    if (index >= 0) mockCustomers.splice(index, 1);
    return { success: true, data: null, message: 'serviceMessages.deleteSuccess' };
  }

  try {
    const { data } = await apiClient.delete<CustomerResponse<null>>(
      endpoints.customers.detail(id),
    );
    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, 'serviceMessages.deleteFail'),
    };
  }
}
