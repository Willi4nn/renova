import { useState } from 'react';
import { toast } from 'react-toastify';

export function useDeleteItem<T extends { id: string }>(
  deleteFn: (id: string) => Promise<void>,
  successMessage: string = 'Excluído com sucesso!',
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
    setIsLoading(false);
  };

  const confirm = async () => {
    if (!item) return;

    setIsLoading(true);
    try {
      await deleteFn(item.id);
      toast.success(successMessage);
      close();
    } catch {
      // Error handling in store
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
