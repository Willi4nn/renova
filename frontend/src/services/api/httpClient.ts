import axios, { AxiosError } from 'axios';
import type { ApiError } from '../../types/api';

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'http://localhost:3333/api';
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
};

const API_BASE_URL = getBaseUrl();

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
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status || 500;
    const data = error.response?.data;
    throw new ApiClientError(
      data?.error || 'Erro no servidor',
      status,
      data?.details,
    );
  },
);
