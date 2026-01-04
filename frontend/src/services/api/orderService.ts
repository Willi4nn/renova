import type { Order } from '../../types';
import type { CreateOrderRequest, UpdateOrderRequest } from '../../types/api';
import { api } from './httpClient';

export const OrderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('orders');
    return response.data;
  },
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`orders/${id}`);
    return response.data;
  },
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('orders', data);
    return response.data;
  },
  update: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await api.put<Order>(`orders/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`orders/${id}`);
  },
};
