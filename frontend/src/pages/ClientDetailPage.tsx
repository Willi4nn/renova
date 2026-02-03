import { ArrowLeft, MapPin, Pencil, Phone, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientModal } from '../components/features/Modal/ClientModal';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { ServiceTable } from '../components/features/ServiceTable/ServiceTable';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Spinner } from '../components/ui/Spinner';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import type { Service } from '../types';
import { formatCurrency, formatDate, formatPhone } from '../utils/formatters';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getClientById,
    fetchClients,
    isLoading: clientLoading,
  } = useClientStore();
  const {
    services,
    isLoading: servicesLoading,
    fetchServices,
    removeService,
  } = useServiceStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const client = getClientById(id || '');

  const deleteModal = useDeleteItem<Service>(
    removeService,
    'Serviço removido com sucesso!',
  );

  useEffect(() => {
    if (!client) {
      fetchClients();
    }
    fetchServices();
  }, [client, fetchClients, fetchServices]);

  if (clientLoading) {
    return <Spinner />;
  }

  if (!client) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">Cliente não encontrado</p>
        <Button onClick={() => navigate('/clients')} className="mt-4">
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  const clientServices = services.filter(
    (service) => service.client_id === client.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={() => navigate('/clients')}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <PageHeader
            title={client.name}
            description={`Cliente desde ${formatDate(client.created_at)}`}
          />
        </div>
        <Button onClick={() => setIsEditModalOpen(true)} variant="secondary">
          <div className="flex items-center gap-2">
            <Pencil size={18} />
            <span>Editar Cliente</span>
          </div>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Informações de Contato
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone size={20} className="mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium text-gray-900">
                  {formatPhone(client.phone_number)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p className="font-medium text-gray-900">{client.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientServices.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  clientServices.reduce(
                    (sum, service) => sum + service.final_price,
                    0,
                  ),
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  clientServices.filter((o) => o.status === 'IN_PROGRESS')
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Concluídos</p>
              <p className="text-2xl font-bold text-green-600">
                {clientServices.filter((o) => o.status === 'PAID').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Serviços do Cliente
          </h3>
          <Button
            onClick={() =>
              navigate('/services/new', { state: { clientId: client.id } })
            }
          >
            <div className="flex items-center gap-2">
              <Plus size={18} />
              <span>Novo Serviço</span>
            </div>
          </Button>
        </div>

        {servicesLoading ? (
          <Spinner />
        ) : (
          <>
            <ServiceTable
              services={clientServices}
              hideClientColumn={true}
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

      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
        title="Editar Cliente"
      />
    </div>
  );
}
