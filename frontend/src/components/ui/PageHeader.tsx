import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  titleSize?: string;
}

export function PageHeader({
  title,
  description,
  action,
  titleSize = 'text-2xl',
}: PageHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className={`${titleSize} font-bold tracking-tight`}>{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="w-full md:w-auto">{action}</div>}
    </div>
  );
}
