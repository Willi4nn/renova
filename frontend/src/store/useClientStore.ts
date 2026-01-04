import { create } from 'zustand';
import { ClientService } from '../services/api/clientService';
import { ApiClientError } from '../services/api/httpClient';
import type { Client } from '../types';
import type { CreateClientRequest, UpdateClientRequest } from '../types/api';

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  errorDetails?: Array<{ field: string; message: string }>;

  fetchClients: () => Promise<void>;
  addClient: (data: CreateClientRequest) => Promise<void>;
  editClient: (id: string, data: UpdateClientRequest) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
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

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,
  errorDetails: undefined,

  fetchClients: async () => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const data = await ClientService.getAll();
      set({ clients: data, isLoading: false });
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao buscar clientes',
        errorDetails: details,
        isLoading: false,
      });
    }
  },

  addClient: async (data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const newClient = await ClientService.create(data);
      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao adicionar cliente',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  editClient: async (id, data) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      const updatedClient = await ClientService.update(id, data);
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao editar cliente',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  removeClient: async (id) => {
    set({ isLoading: true, error: null, errorDetails: undefined });
    try {
      await ClientService.delete(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      const { message, details } = getErrorMessage(err);
      set({
        error: message || 'Erro ao remover cliente',
        errorDetails: details,
        isLoading: false,
      });
      throw err;
    }
  },

  getClientById: (id: string) => {
    return get().clients.find((client) => client.id === id);
  },

  clearError: () => set({ error: null, errorDetails: undefined }),
}));
