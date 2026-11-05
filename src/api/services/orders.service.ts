import { apiClient, getErrorMessage } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { mockOrders } from '@/api/mock/data';
import { mockDelay } from '@/api/mock/delay';
import { env } from '@/config/env';
import type { IOrder, OrderResponse } from '@/types/orders.types';

export async function fetchAllOrders(
  page = 0,
  limit = 20,
  filters?: Record<string, string>,
): Promise<OrderResponse<{ orders: IOrder[]; total: number }>> {
  if (env.useMockApi) {
    await mockDelay();
    const search = filters?.search?.toLowerCase().trim();
    let orders = [...mockOrders];
    if (search) {
      orders = orders.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(search) ||
          o.customerName?.toLowerCase().includes(search) ||
          o.customerPhone?.toLowerCase().includes(search),
      );
    }
    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }
    const total = orders.length;
    const sliced = limit > 0 ? orders.slice(page * limit, page * limit + limit) : orders;
    return {
      success: true,
      data: { orders: sliced, total },
      message: 'serviceMessages.fetchSuccess',
    };
  }

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
  if (env.useMockApi) {
    await mockDelay();
    const now = new Date().toISOString();
    if (order._id) {
      const index = mockOrders.findIndex((o) => o._id === order._id);
      if (index >= 0) {
        mockOrders[index] = { ...mockOrders[index], ...order, updatedAt: now };
        return {
          success: true,
          data: mockOrders[index],
          message: 'serviceMessages.updateSuccess',
        };
      }
    }
    const created: IOrder = {
      ...order,
      _id: `ord-${Date.now()}`,
      ownerId: 'user-1',
      orderNumber: order.orderNumber ?? `ORD-${1000 + mockOrders.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    mockOrders.unshift(created);
    return {
      success: true,
      data: created,
      message: 'serviceMessages.createSuccess',
    };
  }

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
  if (env.useMockApi) {
    await mockDelay();
    const index = mockOrders.findIndex((o) => o._id === id);
    if (index >= 0) mockOrders.splice(index, 1);
    return { success: true, data: null, message: 'serviceMessages.deleteSuccess' };
  }

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
