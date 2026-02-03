import { AlertTriangle } from 'lucide-react';
import { Modal } from '.';
import { Button } from '../../ui/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  description = 'Tem certeza que deseja excluir este registro?',
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3 text-red-800">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <p className="text-sm">{description}</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
