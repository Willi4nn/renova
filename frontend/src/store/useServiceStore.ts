import { create } from 'zustand';
import { ApiClientError } from '../services/api/httpClient';
import { ServiceService } from '../services/api/serviceService';
import type { Service } from '../types';
import type { CreateServiceRequest, UpdateServiceRequest } from '../types/api';

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  errorDetails?: Array<{ field: string; message: string }>;

  fetchServices: () => Promise<void>;
  addService: (data: CreateServiceRequest) => Promise<void>;
  editService: (id: string, data: UpdateServiceRequest) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
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

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,
  errorDetails: undefined,

  fetchServices: async () => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const data = await ServiceService.getAll();
      set({ services: data, isLoading: false });
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao buscar serviços',
        errorDetails: details,
        isLoading: false,
      });
    }
  },

  addService: async (data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const newService = await ServiceService.create(data);
      set((state) => ({
        services: [newService, ...state.services],
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

  editService: async (id, data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const updatedService = await ServiceService.update(id, data);
      set((state) => ({
        services: state.services.map((s) => (s.id === id ? updatedService : s)),
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

  removeService: async (id) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      await ServiceService.delete(id);
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
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

  getServiceById: (id: string) => {
    return get().services.find((service) => service.id === id);
  },

  clearError: () => set({ error: null, errorDetails: undefined }),
}));
