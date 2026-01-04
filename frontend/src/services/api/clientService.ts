import type { Client } from '../../types';
import type { CreateClientRequest, UpdateClientRequest } from '../../types/api';
import { api } from './httpClient';

export const ClientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('clients');
    return response.data;
  },
  getById: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`clients/${id}`);
    return response.data;
  },
  create: async (data: CreateClientRequest): Promise<Client> => {
    const response = await api.post<Client>('clients', data);
    return response.data;
  },
  update: async (id: string, data: UpdateClientRequest): Promise<Client> => {
    const response = await api.put<Client>(`clients/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`clients/${id}`);
  },
};
