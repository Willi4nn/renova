import { STATUS_MAP } from '../../constants/serviceStatus';
import type { ServiceStatus } from '../../types';

interface StatusBadgeProps {
  status: ServiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = STATUS_MAP[status];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold uppercase ${color}`}
      style={{ minWidth: '100px' }}
    >
      {label}
    </span>
  );
}
