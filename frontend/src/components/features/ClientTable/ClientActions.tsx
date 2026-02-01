import { Pencil, Trash2 } from 'lucide-react';

interface ClientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientActions({ onEdit, onDelete }: ClientActionsProps) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="group rounded p-1.5 text-blue-600 transition-all duration-200"
        aria-label="Editar"
      >
        <Pencil
          size={16}
          className="transition-transform duration-200 group-hover:-rotate-20"
        />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="group rounded p-1.5 text-red-600 transition-all duration-200"
        aria-label="Deletar"
      >
        <Trash2
          size={16}
          className="transition-transform duration-200 group-hover:-rotate-20"
        />
      </button>
    </>
  );
}
