import type { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  valueColor?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  valueColor = 'text-slate-900',
}: MetricCardProps) {
  return (
    <div className="card-base group flex cursor-default items-center justify-between p-4 transition-colors hover:bg-slate-50/50">
      <div>
        <p className="text-md font-medium text-slate-500 group-hover:text-slate-600">
          {title}
        </p>
        <h4 className={`mt-0.5 text-xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </h4>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors group-hover:bg-slate-200">
        {icon}
      </div>
    </div>
  );
}
