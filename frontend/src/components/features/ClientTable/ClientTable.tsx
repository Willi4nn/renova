import { useNavigate } from 'react-router-dom';
import type { Client } from '../../../types';
import { formatPhone } from '../../../utils/formatters';
import { DataTable } from '../DataTable';
import { TableActions } from '../TableActions';
import { getClientColumns } from './ClientColumns';

interface ClientTableProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

const clientColumns = getClientColumns();

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  return (
    <DataTable
      columns={clientColumns}
      data={clients}
      keyExtractor={(client) => client.id}
      onRowClick={handleRowClick}
      actions={
        onEdit && onDelete
          ? (client) => (
              <TableActions
                onEdit={() => onEdit(client)}
                onDelete={() => onDelete(client)}
              />
            )
          : undefined
      }
      mobileCard={(client, actions) => (
        <div
          key={client.id}
          className="card-base cursor-pointer p-3 hover:border-blue-300"
          onClick={() => handleRowClick(client)}
        >
          <div className="mb-2 grid w-full grid-cols-[1fr_auto] items-start gap-3">
            <div className="min-w-0">
              <h3
                className="truncate font-medium text-gray-900"
                title={client.name}
              >
                {client.name}
              </h3>
              <p className="truncate text-sm text-gray-600">
                {formatPhone(client.phone_number)}
              </p>
            </div>

            {actions && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {actions}
              </div>
            )}
          </div>

          <div className="grid w-full">
            <p
              className="truncate text-sm text-gray-600"
              title={client.address}
            >
              {client.address}
            </p>
          </div>
        </div>
      )}
      emptyMessage="Nenhum cliente encontrado"
    />
  );
}
