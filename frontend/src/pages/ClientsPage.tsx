import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import type { Column } from '../components/ui/DataTable';
import { DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { useClientStore } from '../store/useClientStore';
import type { Client } from '../types';
import { formatPhone } from '../utils/formatters';

export function ClientsPage() {
  const { clients, isLoading, fetchClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone_number.includes(searchTerm),
  );

  const columns: Column<Client>[] = [
    {
      label: 'Nome',
      accessor: 'name',
      sortable: true,
      render: (client) => (
        <span className="font-medium text-gray-900">{client.name}</span>
      ),
    },
    {
      label: 'Telefone',
      accessor: 'phone_number',
      render: (client) => (
        <span className="text-gray-600">
          {formatPhone(client.phone_number)}
        </span>
      ),
    },
    {
      label: 'Endereço',
      accessor: 'address',
      mobileHidden: true,
      render: (client) => (
        <span className="text-gray-600">{client.address}</span>
      ),
    },
  ];

  const handleEdit = (_client: Client) => {};

  const handleDelete = (_client: Client) => {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes da estofaria"
        action={
          <Button>
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
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Carregando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredClients}
          keyExtractor={(client) => client.id}
          actions={(client) => (
            <>
              <button
                onClick={() => handleEdit(client)}
                className="rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-100"
                aria-label="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(client)}
                className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-100"
                aria-label="Deletar"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          mobileCard={(client, actions) => (
            <div
              key={client.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatPhone(client.phone_number)}
                  </p>
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
              </div>
              <div className="text-sm text-gray-600">{client.address}</div>
            </div>
          )}
          emptyMessage="Nenhum cliente encontrado"
        />
      )}
    </div>
  );
}
