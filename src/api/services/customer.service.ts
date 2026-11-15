import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { CustomerResponse, ICustomer } from '@/types/customer.types';

export async function fetchAllCustomers(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<CustomerResponse<{ customers: ICustomer[]; total: number }>> {
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
  try {
    const { _id, ownerId: _ownerId, createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = customer;
    const { data } = _id
      ? await apiClient.patch<CustomerResponse<ICustomer>>(
          endpoints.customers.detail(_id),
          payload,
        )
      : await apiClient.post<CustomerResponse<ICustomer>>(endpoints.customers.list, payload);
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
