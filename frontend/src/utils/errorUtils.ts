import { ApiClientError } from '../services/api/httpClient';

export const getErrorMessage = (
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
