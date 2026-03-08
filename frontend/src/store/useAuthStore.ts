import { create } from 'zustand';
import { api } from '../services/api/httpClient';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  registerUser: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    set({ user: response.data.user, isAuthenticated: true });
  },

  registerUser: async (credentials) => {
    await api.post('/auth/register', credentials);
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignora erro se o token já era inválido
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      if (status !== 401) {
        console.error('Erro no checkAuth:', error);
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
