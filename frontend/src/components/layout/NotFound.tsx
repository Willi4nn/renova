import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
  message: string;
  backTo: string;
  backLabel: string;
}

export function NotFound({ message, backTo, backLabel }: NotFoundProps) {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <Info className="mx-auto mb-4 text-slate-400" size={40} />
      <p className="text-lg font-medium text-slate-600">{message}</p>
      <button
        onClick={() => navigate(backTo)}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        {backLabel}
      </button>
    </div>
  );
}
