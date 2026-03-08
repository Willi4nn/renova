import { useState } from 'react';
import { toast } from 'react-toastify';

export function useDeleteItem<T extends { id: string }>(
  deleteFn: (id: string) => Promise<void>,
  successMessage: string = 'Excluído com sucesso!',
  onSuccess?: () => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = (item: T) => {
    setItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setItem(null);
  };

  const confirm = async () => {
    if (!item) return;

    setIsLoading(true);
    try {
      await deleteFn(item.id);
      toast.success(successMessage);
      onSuccess?.();
      close();
    } catch {
      // O erro já é tratado no store
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    item,
    isLoading,
    open,
    close,
    confirm,
  };
}
