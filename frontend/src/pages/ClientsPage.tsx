import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClientColumns } from '../components/features/ClientTable/ClientColumns';
import { DataTable } from '../components/features/DataTable';
import { ClientModal } from '../components/features/Modal/ClientModal';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { TableActions } from '../components/features/TableActions';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import type { Client } from '../types';
import { formatPhone, normalizeString } from '../utils/formatters';

export function ClientsPage() {
  const navigate = useNavigate();
  const { clients, isLoading, fetchClients, removeClient } = useClientStore();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clientColumns = getClientColumns();

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

  const deleteModal = useDeleteItem<Client>(
    removeClient,
    'Cliente removido com sucesso!',
  );

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
        <DataTable
          columns={clientColumns}
          data={filteredClients}
          keyExtractor={(client) => client.id}
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
          actions={(client) => (
            <TableActions
              onEdit={() => handleEdit(client)}
              onDelete={() => deleteModal.open(client)}
            />
          )}
          mobileCard={(client, actions) => (
            <div
              key={client.id}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-300"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatPhone(client.phone_number)}
                  </p>
                </div>
                {actions && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">{client.address}</div>
            </div>
          )}
          emptyMessage="Nenhum cliente encontrado"
        />
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
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        isLoading={deleteModal.isLoading}
        description={`Esta ação excluirá todos os serviços associados e não pode ser desfeita. Tem certeza?`}
      />
    </div>
  );
}
