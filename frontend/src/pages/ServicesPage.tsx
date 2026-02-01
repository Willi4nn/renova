import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from '../components/features/DataTable';
import { ServiceActions } from '../components/features/ServiceTable/ServiceActions';
import { getServiceColumns } from '../components/features/ServiceTable/ServiceColumns';
import { StatusFilter } from '../components/features/StatusFilter';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
import { STATUS_MAP } from '../constants/serviceStatus';
import { useServiceStore } from '../store/useServiceStore';
import type { Service, ServiceStatus } from '../types';
import {
  formatCurrency,
  formatDate,
  normalizeString,
} from '../utils/formatters';

export function ServicesPage() {
  const { services, isLoading, fetchServices } = useServiceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'ALL'>(
    'ALL',
  );

  const serviceColumns = getServiceColumns();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter((service) => {
    const searchTermNormalized = normalizeString(searchTerm);
    const furnitureNameNormalized = normalizeString(service.furniture_name);
    const clientNameNormalized = normalizeString(service.client?.name || '');

    const matchesSearch =
      furnitureNameNormalized.includes(searchTermNormalized) ||
      clientNameNormalized.includes(searchTermNormalized);

    const matchesStatus =
      statusFilter === 'ALL' || service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (_service: Service) => {};

  const handleDelete = (_service: Service) => {};

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por móvel ou cliente..."
          className="flex-1 sm:max-w-sm"
        />
        <StatusFilter
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-[200px]"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={serviceColumns}
          data={filteredServices}
          keyExtractor={(service) => service.id}
          actions={(service) => (
            <ServiceActions
              onEdit={() => handleEdit(service)}
              onDelete={() => handleDelete(service)}
            />
          )}
          mobileCard={(service, actions) => (
            <div
              key={service.id}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {service.furniture_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cliente {service.client?.name || '—'}
                  </p>
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
              </div>
              <div className="space-y-1">
                <div>
                  {(() => {
                    const status = STATUS_MAP[service.status];
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
                  Coleta: {formatDate(service.collection_date)}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(service.final_price)}
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
