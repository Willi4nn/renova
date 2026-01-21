import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import type { Column } from '../components/ui/DataTable';
import { DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { STATUS_MAP } from '../constants/orderStatus';
import { useOrderStore } from '../store/useOrderStore';
import type { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export function ServicesPage() {
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) =>
    order.furniture_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: Column<Order>[] = [
    {
      label: 'Móvel',
      accessor: 'furniture_name',
      sortable: true,
      render: (order) => (
        <span className="text-gray-900">{order.furniture_name}</span>
      ),
    },
    {
      label: 'Cliente',
      accessor: 'client',
      sortable: true,
      render: (order) => (
        <span className="font-medium text-gray-900">
          {order.client?.name || '—'}
        </span>
      ),
    },
    {
      label: 'Tecido',
      accessor: 'fabric_name',
      mobileHidden: true,
      render: (order) => (
        <span className="text-gray-600">{order.fabric_name}</span>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      render: (order) => {
        const status = STATUS_MAP[order.status];
        return (
          <span
            className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      label: 'Coleta',
      accessor: 'collection_date',
      sortable: true,
      mobileHidden: true,
      render: (order) => (
        <span className="text-gray-600">
          {formatDate(order.collection_date)}
        </span>
      ),
    },
    {
      label: 'Preço Final',
      accessor: 'final_price',
      mobileHidden: true,
      render: (order) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(order.final_price)}
        </span>
      ),
    },
  ];

  const handleEdit = (_order: Order) => {};

  const handleDelete = (_order: Order) => {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Serviços"
        description="Gerencie todos os serviços da estofaria"
        action={
          <Button>
            <div className="flex items-center gap-2">
              <Plus size={18} />
              <span>Novo Serviço</span>
            </div>
          </Button>
        }
      />

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por móvel..."
        className="w-full md:max-w-sm"
      />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Carregando...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          actions={(order) => (
            <>
              <button
                onClick={() => handleEdit(order)}
                className="rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                aria-label="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(order)}
                className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50"
                aria-label="Deletar"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          mobileCard={(order, actions) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {order.furniture_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cliente #{order.client_id.substring(0, 8)}
                  </p>
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
              </div>
              <div className="space-y-1">
                <div>
                  {(() => {
                    const status = STATUS_MAP[order.status];
                    return (
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm text-gray-600">
                  Coleta: {formatDate(order.collection_date)}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.final_price)}
                </p>
              </div>
            </div>
          )}
          emptyMessage="Nenhum serviço encontrado"
        />
      )}
    </div>
  );
}
