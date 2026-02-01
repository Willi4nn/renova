import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClientModal } from '../components/features/ClientModal';
import { ClientActions } from '../components/features/ClientTable/ClientActions';
import { getClientColumns } from '../components/features/ClientTable/ClientColumns';
import { DataTable } from '../components/features/DataTable';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
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

  const handleDelete = async (client: Client) => {
    try {
      await removeClient(client.id);
      toast.success('Cliente removido com sucesso!');
    } catch {
      toast.error('Erro ao remover cliente');
    }
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
        <DataTable
          columns={clientColumns}
          data={filteredClients}
          keyExtractor={(client) => client.id}
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
          actions={(client) => (
            <ClientActions
              onEdit={() => handleEdit(client)}
              onDelete={() => handleDelete(client)}
            />
          )}
          mobileCard={(client, actions) => (
            <div
              key={client.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
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
    </div>
  );
}
