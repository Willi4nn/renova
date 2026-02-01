import type { Service } from '../../types';
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
} from '../../types/api';
import { api } from './httpClient';

export const ServiceService = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('services');
    return response.data;
  },
  getById: async (id: string): Promise<Service> => {
    const response = await api.get<Service>(`services/${id}`);
    return response.data;
  },
  create: async (data: CreateServiceRequest): Promise<Service> => {
    const response = await api.post<Service>('services', data);
    return response.data;
  },
  update: async (id: string, data: UpdateServiceRequest): Promise<Service> => {
    const response = await api.put<Service>(`services/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`services/${id}`);
  },
};
