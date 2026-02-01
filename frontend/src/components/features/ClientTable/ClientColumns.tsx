import type { Client } from '../../../types';
import { formatPhone } from '../../../utils/formatters';
import type { Column } from '../DataTable';

export const getClientColumns = (): Column<Client>[] => [
  {
    label: 'Nome',
    accessor: 'name',
    sortable: true,
    className: 'w-1/3 min-w-[180px]',
    render: (client) => (
      <div
        className="block max-w-[300px] truncate font-medium text-gray-900 hover:text-blue-600"
        title={client.name}
      >
        {client.name}
      </div>
    ),
  },
  {
    label: 'Telefone',
    accessor: 'phone_number',
    className: 'w-44 whitespace-nowrap',
    render: (client) => (
      <span className="text-gray-600">{formatPhone(client.phone_number)}</span>
    ),
  },
  {
    label: 'Endereço',
    accessor: 'address',
    mobileHidden: true,
    className: 'max-w-xs',
    render: (client) => (
      <div className="truncate text-gray-600" title={client.address}>
        {client.address}
      </div>
    ),
  },
];
