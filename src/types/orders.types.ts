export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'delivered';

export interface IOrder {
  _id?: string;
  ownerId?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  measurementId?: string | null;
  orderNumber?: string;
  price: number;
  advancePaid: number;
  status: OrderStatus;
  orderDate: string | Date;
  dueDate: string | Date;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface OrderResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
