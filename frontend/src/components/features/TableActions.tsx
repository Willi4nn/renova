import { Pencil, Trash2 } from 'lucide-react';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function TableActions({
  onEdit,
  onDelete,
  editLabel = 'Editar',
  deleteLabel = 'Excluir',
}: TableActionsProps) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="group rounded p-1.5 text-blue-600 transition-all duration-200 hover:bg-blue-50"
        aria-label={editLabel}
      >
        <Pencil
          size={18}
          className="transition-transform duration-200 group-hover:-rotate-12"
        />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="group rounded p-1.5 text-red-600 transition-all duration-200 hover:bg-red-50"
        aria-label={deleteLabel}
      >
        <Trash2
          size={18}
          className="transition-transform duration-200 group-hover:-rotate-12"
        />
      </button>
    </>
  );
}
