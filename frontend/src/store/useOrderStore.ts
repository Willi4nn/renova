import { create } from 'zustand';
import { ApiClientError } from '../services/api/httpClient';
import { OrderService } from '../services/api/orderService';
import type { Order } from '../types';
import type { CreateOrderRequest, UpdateOrderRequest } from '../types/api';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  errorDetails?: Array<{ field: string; message: string }>;

  fetchOrders: () => Promise<void>;
  addOrder: (data: CreateOrderRequest) => Promise<void>;
  editOrder: (id: string, data: UpdateOrderRequest) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  clearError: () => void;
}

const getErrorMessage = (
  err: unknown,
): { message: string; details?: Array<{ field: string; message: string }> } => {
  if (err instanceof ApiClientError) {
    return { message: err.message, details: err.details };
  }
  if (err instanceof Error) {
    return { message: err.message };
  }
  return { message: 'Erro desconhecido' };
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  errorDetails: undefined,

  fetchOrders: async () => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const data = await OrderService.getAll();
      set({ orders: data, isLoading: false });
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao buscar serviços',
        errorDetails: details,
        isLoading: false,
      });
    }
  },

  addOrder: async (data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const newOrder = await OrderService.create(data);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao adicionar serviço',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  editOrder: async (id, data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const updatedOrder = await OrderService.update(id, data);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao editar serviço',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  removeOrder: async (id) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      await OrderService.delete(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao remover serviço',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  getOrderById: (id: string) => {
    return get().orders.find((order) => order.id === id);
  },

  clearError: () => set({ error: null, errorDetails: undefined }),
}));
