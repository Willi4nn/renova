import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable, type Column } from '../components/features/DataTable';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
import { STATUS_MAP } from '../constants/orderStatus';
import { useOrderStore } from '../store/useOrderStore';
import type { Order } from '../types';
import {
  formatCurrency,
  formatDate,
  normalizeString,
} from '../utils/formatters';

export function ServicesPage() {
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const searchTermNormalized = normalizeString(searchTerm);

    const furnitureNameNormalized = normalizeString(order.furniture_name);
    const clientNameNormalized = normalizeString(order.client?.name || '');

    return (
      furnitureNameNormalized.includes(searchTermNormalized) ||
      clientNameNormalized.includes(searchTermNormalized)
    );
  });

  const columns: Column<Order>[] = [
    {
      label: 'Móvel',
      accessor: 'furniture_name',
      sortable: true,
      className: 'min-w-[140px]',
      render: (order) => (
        <span className="font-semibold text-gray-900">
          {order.furniture_name}
        </span>
      ),
    },
    {
      label: 'Cliente',
      accessor: 'client',
      sortable: true,
      className: 'w-1/5 min-w-[120px]',
      render: (order) => (
        <span className="text-gray-700">{order.client?.name || '—'}</span>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      className: 'w-40',
      render: (order) => {
        const status = STATUS_MAP[order.status];
        return (
          <span
            className={`text inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-bold tracking-tight uppercase ${status.color}`}
            style={{ minWidth: '100px' }}
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
      className: 'w-32',
      render: (order) => (
        <span className="whitespace-nowrap text-gray-600">
          {formatDate(order.collection_date)}
        </span>
      ),
    },
    {
      label: 'Preço Final',
      accessor: 'final_price',
      mobileHidden: true,
      className: 'text-right w-32',
      render: (order) => (
        <span className="font-bold text-gray-900">
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
        <Spinner />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          actions={(order) => (
            <>
              <button
                onClick={() => handleEdit(order)}
                className="group rounded p-1.5 text-blue-600 transition-all duration-200"
                aria-label="Editar"
              >
                <Pencil
                  size={16}
                  className="transition-transform duration-200 group-hover:-rotate-20"
                />
              </button>
              <button
                onClick={() => handleDelete(order)}
                className="group rounded p-1.5 text-red-600 transition-all duration-200"
                aria-label="Deletar"
              >
                <Trash2
                  size={16}
                  className="transition-transform duration-200 group-hover:-rotate-20"
                />
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
                    Cliente {order.client?.name || '—'}
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
                        className={`inline-flex rounded-full px-3 py-2 text-xs font-medium ${status.color}`}
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
