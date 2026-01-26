import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { usePhoneMask } from '../../hooks/usePhoneMask';
import { useClientStore } from '../../store/useClientStore';
import type { Client } from '../../types';
import { clientSchema, type ClientFormData } from '../../utils/validation';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { FormField } from './FormField';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  title?: string;
}

export function ClientModal({
  isOpen,
  onClose,
  client,
  title = 'Novo Cliente',
}: ClientModalProps) {
  const { addClient, editClient, isLoading, error, clearError } =
    useClientStore();
  const { displayValue, setDisplayValue, handlePhoneChange } = usePhoneMask(
    client?.phone_number || '',
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (client) {
        reset(client);
        setDisplayValue(client?.phone_number || '');
      } else {
        reset({
          name: '',
          phone_number: '',
          address: '',
        });
        setDisplayValue('');
      }
      clearError();
    }
  }, [isOpen, reset, clearError, setDisplayValue, client]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (client) {
        await editClient(client.id, data);
        toast.success('Cliente editado com sucesso!');
      } else {
        await addClient(data);
        toast.success('Cliente adicionado com sucesso!');
      }
      setDisplayValue(client?.phone_number || '');
      onClose();
    } catch {
      // Error handling in store
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = handlePhoneChange(e.target.value);
    setValue('phone_number', rawValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <FormField label="Nome" error={errors.name?.message} required>
          <Input
            {...register('name')}
            placeholder="Nome completo"
            error={!!errors.name}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="Telefone"
          error={errors.phone_number?.message}
          required
        >
          <Input
            {...register('phone_number')}
            value={displayValue}
            onChange={handlePhoneInput}
            placeholder="(00) 00000-0000"
            error={!!errors.phone_number}
            disabled={isLoading}
            maxLength={15}
          />
        </FormField>

        <FormField label="Endereço" error={errors.address?.message} required>
          <Input
            {...register('address')}
            placeholder="Rua, número, bairro, cidade"
            error={!!errors.address}
            disabled={isLoading}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || (!!client && !isDirty)}
            className="bg-renova-teal flex items-center gap-2 rounded-md px-4 py-2 text-white transition-colors hover:brightness-110 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
