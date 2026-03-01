import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { PageHeader } from './PageHeader';

interface DetailPageAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface DetailPageHeaderProps {
  backTo: string;
  title: string;
  description?: string;
  actions?: DetailPageAction[];
}

export function DetailPageHeader({
  backTo,
  title,
  description,
  actions = [],
}: DetailPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-3">
        <button
          onClick={() => navigate(backTo)}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader title={title} description={description} />
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant ?? 'secondary'}
            >
              <div className="flex items-center gap-2">
                {action.icon}
                <span>{action.label}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
