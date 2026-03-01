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
          className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-300"
          onClick={() => handleRowClick(service)}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {service.furniture_name}
              </h3>
              {!hideClientColumn && (
                <p className="text-sm text-gray-600">
                  Cliente: {service.client?.name || '—'}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {actions}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <StatusBadge status={service.status} />
              <p className="text-xs text-gray-500">
                Coleta: {formatDate(service.collection_date)}
              </p>
            </div>
            <span className="font-bold text-gray-900">
              {formatCurrency(service.final_price)}
            </span>
          </div>
        </div>
      )}
      emptyMessage="Nenhum serviço encontrado"
    />
  );
}
