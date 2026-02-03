import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { ServiceTable } from '../components/features/ServiceTable/ServiceTable';
import { StatusFilter } from '../components/features/StatusFilter';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { Spinner } from '../components/ui/Spinner';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useServiceStore } from '../store/useServiceStore';
import type { Service, ServiceStatus } from '../types';
import { normalizeString } from '../utils/formatters';

export function ServicesPage() {
  const navigate = useNavigate();
  const { services, isLoading, fetchServices, removeService } =
    useServiceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'ALL'>(
    'ALL',
  );

  const deleteModal = useDeleteItem<Service>(
    removeService,
    'Serviço removido com sucesso!',
  );

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Serviços"
        description="Gerencie todos os serviços da estofaria"
        action={
          <Button onClick={() => navigate('/services/new')}>
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
        <>
          <ServiceTable
            services={filteredServices}
            onEdit={(service) => navigate(`/services/${service.id}/edit`)}
            onDelete={deleteModal.open}
          />

          <ConfirmDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.close}
            onConfirm={deleteModal.confirm}
            isLoading={deleteModal.isLoading}
            description={`Deseja excluir o serviço: ${deleteModal.item?.furniture_name}?`}
          />
        </>
      )}
    </div>
  );
}
