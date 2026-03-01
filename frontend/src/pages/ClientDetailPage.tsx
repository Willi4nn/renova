import { MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientModal } from '../components/features/Modal/ClientModal';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { ServiceTable } from '../components/features/ServiceTable/ServiceTable';
import { NotFound } from '../components/layout/NotFound';
import { Button } from '../components/ui/Button';
import { DetailPageHeader } from '../components/ui/DetailPageHeader';
import { Spinner } from '../components/ui/Spinner';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import type { Client, Service } from '../types';
import { formatCurrency, formatDate, formatPhone } from '../utils/formatters';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getClientById,
    fetchClients,
    removeClient,
    isLoading: clientLoading,
  } = useClientStore();
  const {
    services,
    isLoading: servicesLoading,
    removeService,
    fetchServices,
  } = useServiceStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const client = getClientById(id || '');

  const deleteClientModal = useDeleteItem<Client>(
    removeClient,
    'Cliente removido com sucesso!',
  );

  const deleteServiceModal = useDeleteItem<Service>(
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
      <NotFound
        message="Cliente não encontrado"
        backTo="/clients"
        backLabel="Voltar para Clientes"
      />
    );
  }

  const clientServices = services.filter(
    (service) => service.client_id === client.id,
  );

  return (
    <div className="space-y-6">
      <DetailPageHeader
        backTo="/clients"
        title={client.name}
        description={`Cliente desde ${formatDate(client.created_at)}`}
        actions={[
          {
            label: 'Editar Cliente',
            icon: <Pencil size={18} />,
            onClick: () => setIsEditModalOpen(true),
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={18} />,
            onClick: () => deleteClientModal.open(client),
            variant: 'danger',
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-base p-6">
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

        <div className="card-base p-6">
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
              onDelete={deleteServiceModal.open}
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

      <ConfirmDeleteModal
        isOpen={deleteServiceModal.isOpen}
        onClose={deleteServiceModal.close}
        onConfirm={deleteServiceModal.confirm}
        isLoading={deleteServiceModal.isLoading}
        description={`Esta ação não pode ser desfeita. Deseja excluir permanentemente o serviço: ${deleteServiceModal.item?.furniture_name}?`}
      />

      <ConfirmDeleteModal
        isOpen={deleteClientModal.isOpen}
        onClose={deleteClientModal.close}
        onConfirm={deleteClientModal.confirm}
        isLoading={deleteClientModal.isLoading}
        description={`Esta ação excluirá todos os serviços associados e não pode ser desfeita. Tem certeza?`}
      />
    </div>
  );
}
