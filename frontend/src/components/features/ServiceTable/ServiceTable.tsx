import { useNavigate } from 'react-router-dom';
import type { Service } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { StatusBadge } from '../../ui/StatusBadge';
import { DataTable } from '../DataTable';
import { TableActions } from '../TableActions';
import { getServiceColumns } from './ServiceColumns';

interface ServiceTableProps {
  services: Service[];
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  hideClientColumn?: boolean;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  hideClientColumn = false,
}: ServiceTableProps) {
  const navigate = useNavigate();
  const columns = getServiceColumns(hideClientColumn);

  const handleRowClick = (service: Service) => {
    navigate(`/services/${service.id}`);
  };

  return (
    <DataTable
      columns={columns}
      data={services}
      keyExtractor={(service) => service.id}
      onRowClick={handleRowClick}
      actions={
        onEdit && onDelete
          ? (service) => (
              <TableActions
                onEdit={() => onEdit(service)}
                onDelete={() => onDelete(service)}
              />
            )
          : undefined
      }
      mobileCard={(service, actions) => (
        <div
          key={service.id}
          className="card-base w-full cursor-pointer overflow-hidden p-3 hover:border-blue-300"
          onClick={() => handleRowClick(service)}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="grid flex-1">
              <h3
                className="truncate font-medium text-gray-900"
                title={service.furniture_name}
              >
                {service.furniture_name}
              </h3>
              {!hideClientColumn && (
                <p
                  className="truncate text-sm text-gray-600"
                  title={`Cliente: ${service.client?.name || '—'}`}
                >
                  Cliente: {service.client?.name || '—'}
                </p>
              )}
            </div>
            {actions && (
              <div
                className="flex shrink-0 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {actions}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="grid flex-1 gap-1">
              <p className="truncate text-xs text-gray-500">
                Coleta: {formatDate(service.collection_date)}
              </p>
              <p className="truncate text-xs text-gray-500">
                Entrega:{' '}
                {service.delivery_date
                  ? formatDate(service.delivery_date)
                  : '—'}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5 font-bold text-gray-900">
              <StatusBadge status={service.status} />
              <span className="max-w-[120px] truncate">
                {formatCurrency(service.final_price)}
              </span>
            </div>
          </div>
        </div>
      )}
      emptyMessage="Nenhum serviço encontrado"
    />
  );
}
