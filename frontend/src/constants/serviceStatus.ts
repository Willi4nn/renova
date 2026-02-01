import type { ServiceStatus } from '../types';

export const STATUS_MAP: Record<
  ServiceStatus,
  { label: string; color: string }
> = {
  IN_PROGRESS: {
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-700',
  },
  COMPLETED: { label: 'Concluído', color: 'bg-green-100 text-green-700' },
  DELIVERED: { label: 'Entregue', color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Pago', color: 'bg-teal-100 text-teal-700' },
};
