import { type ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  description: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  isEmpty,
  emptyMessage,
  children,
}: ChartCardProps) {
  return (
    <div className="card-base p-5">
      <div className="mb-4 flex flex-col space-y-0.5">
        <h3 className="text-base leading-none font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      {isEmpty ? (
        <div className="flex h-[320px] items-center justify-center rounded-lg border-2 border-dashed border-slate-100 bg-slate-50/50 text-sm text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="-ml-4 h-[320px] w-full sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
