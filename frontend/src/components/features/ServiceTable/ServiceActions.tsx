import { Pencil, Trash2 } from 'lucide-react';

interface ServiceActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ServiceActions({ onEdit, onDelete }: ServiceActionsProps) {
  return (
    <>
      <button onClick={onEdit} className="group rounded p-1.5 text-blue-600">
        <Pencil
          size={16}
          className="transition-transform group-hover:-rotate-12"
        />
      </button>
      <button onClick={onDelete} className="group rounded p-1.5 text-red-600">
        <Trash2
          size={16}
          className="transition-transform group-hover:-rotate-12"
        />
      </button>
    </>
  );
}
