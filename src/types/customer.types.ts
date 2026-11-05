export interface ICustomer {
  _id?: string;
  ownerId?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
