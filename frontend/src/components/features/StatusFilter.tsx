import { ChevronDown } from 'lucide-react';
import { STATUS_MAP } from '../../constants/serviceStatus';
import type { ServiceStatus } from '../../types';

interface StatusFilterProps {
  value: ServiceStatus | 'ALL';
  onChange: (value: ServiceStatus | 'ALL') => void;
  className?: string;
}

export function StatusFilter({
  value,
  onChange,
  className = '',
}: StatusFilterProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ServiceStatus | 'ALL')}
        className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pr-10 pl-3 text-sm text-slate-700 hover:border-slate-400 focus:border-slate-400 focus:outline-none"
      >
        <option value="ALL">Todos os Status</option>
        {Object.entries(STATUS_MAP).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}
