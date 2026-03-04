import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface DetailPageHeaderProps {
  title: string;
  description?: string;
  backTo: string;
  actions?: Action[];
}

export function DetailPageHeader({
  title,
  description,
  backTo,
  actions,
}: DetailPageHeaderProps) {
  return (
    <div className="flex w-full min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to={backTo}
          className="mb-2 flex w-fit items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold break-all text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm wrap-break-word text-slate-500">
            {description}
          </p>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="mt-2 flex shrink-0 flex-wrap items-center gap-3 self-start sm:mt-0 sm:self-auto">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant}
              className="flex flex-1 items-center justify-center gap-2 sm:flex-none"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
