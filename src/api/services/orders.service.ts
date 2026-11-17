import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { IOrder, OrderResponse } from '@/types/orders.types';

export async function fetchAllOrders(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<OrderResponse<{ orders: IOrder[]; total: number }>> {
  try {
    const { data } = await apiClient.get<
      OrderResponse<{ orders: IOrder[]; total: number }>
    >(endpoints.orders.list, { params: { page, limit, ...filters } });
    return data;
  } catch (error) {
    return {
      success: false,
      data: { orders: [], total: 0 },
      message: getErrorMessage(error, 'serviceMessages.fetchFail'),
    };
  }
}

export async function saveOrder(order: IOrder): Promise<OrderResponse<IOrder | null>> {
  try {
    const { data } = await apiClient.post<OrderResponse<IOrder>>(
      endpoints.orders.list,
      order,
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

export async function deleteOrder(id: string): Promise<OrderResponse<null>> {
  try {
    const { data } = await apiClient.delete<OrderResponse<null>>(
      endpoints.orders.detail(id),
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
