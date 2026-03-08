import type { InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_BASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3333/api'
    : import.meta.env.VITE_API_URL || '/api';

interface ApiErrorResponse {
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

export class ApiClientError extends Error {
  status: number;
  details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    details?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalReq = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status || 500;

    // Refresh automático se der 401 e não for uma requisição de login/refresh já tentada
    if (
      status === 401 &&
      originalReq &&
      !originalReq.url?.includes('/auth/login') &&
      !originalReq.url?.includes('/auth/refresh') &&
      !originalReq._retry
    ) {
      originalReq._retry = true;
      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return api(originalReq); // Refaz a requisição
      } catch {
        // Se o refresh falhar, zera o estado local
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return Promise.reject(error);
      }
    }

    const data = error.response?.data;
    throw new ApiClientError(
      data?.error || 'Erro no servidor',
      status,
      data?.details,
    );
  },
);
