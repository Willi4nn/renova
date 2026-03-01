import type { Service } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { StatusBadge } from '../../ui/StatusBadge';
import type { Column } from '../DataTable';

export const getServiceColumns = (hideClient = false): Column<Service>[] => {
  const columns: Column<Service>[] = [
    {
      label: 'Móvel',
      accessor: 'furniture_name',
      sortable: true,
      className: 'min-w-[140px]',
      render: (service) => (
        <span className="font-semibold text-gray-900">
          {service.furniture_name}
        </span>
      ),
    },
  ];

  if (!hideClient) {
    columns.push({
      label: 'Cliente',
      accessor: 'client.name',
      sortable: true,
      className: 'w-1/5 min-w-[120px]',
      render: (service) => (
        <span className="text-gray-700">{service.client?.name || '—'}</span>
      ),
    });
  }

  columns.push(
    {
      label: 'Status',
      accessor: 'status',
      sortable: true,
      className: 'w-40',
      render: (service) => <StatusBadge status={service.status} />,
    },
    {
      label: 'Coleta',
      accessor: 'collection_date',
      sortable: true,
      mobileHidden: true,
      render: (service) => (
        <span className="text-gray-600">
          {formatDate(service.collection_date)}
        </span>
      ),
    },
    {
      label: 'Preço Final',
      accessor: 'final_price',
      mobileHidden: true,
      className: 'text-right',
      render: (service) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(service.final_price)}
        </span>
      ),
    },
  );

  return columns;
};
