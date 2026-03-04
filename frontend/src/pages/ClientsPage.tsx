import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClientTable } from '../components/features/ClientTable/ClientTable';
import { ClientModal } from '../components/features/Modal/ClientModal';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import type { Client } from '../types';
import { normalizeString } from '../utils/formatters';

export function ClientsPage() {
  const { clients, isLoading, fetchClients, removeClient } = useClientStore();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteModal = useDeleteItem<Client>(
    removeClient,
    'Cliente removido com sucesso!',
  );

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter((client) => {
    const searchTermNormalized = normalizeString(searchTerm);
    const nameNormalized = normalizeString(client.name);
    const phoneNormalized = normalizeString(client.phone_number);

    return (
      nameNormalized.includes(searchTermNormalized) ||
      phoneNormalized.includes(searchTermNormalized)
    );
  });

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes da estofaria"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <div className="flex items-center gap-2">
              <Plus size={18} />
              <span>Novo Cliente</span>
            </div>
          </Button>
        }
      />

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nome ou telefone..."
        className="w-full md:max-w-sm"
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={deleteModal.open}
          />
          <ConfirmDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.close}
            onConfirm={deleteModal.confirm}
            isLoading={deleteModal.isLoading}
            description="Esta ação excluirá todos os serviços associados e não pode ser desfeita. Tem certeza?"
          />
        </>
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        client={editingClient}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      />
    </div>
  );
}
