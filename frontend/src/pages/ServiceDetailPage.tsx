import {
  DollarSign,
  FileText,
  Package,
  Pencil,
  Scissors,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { NotFound } from '../components/layout/NotFound';
import { DetailPageHeader } from '../components/ui/DetailPageHeader';
import { InfoRow } from '../components/ui/InfoRow';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import type { Service } from '../types';
import { formatCurrency } from '../utils/formatters';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getServiceById, fetchServices, removeService, isLoading } =
    useServiceStore();
  const { getClientById, fetchClients } = useClientStore();

  const deleteModal = useDeleteItem<Service>(
    removeService,
    'Serviço removido com sucesso!',
  );

  useEffect(() => {
    fetchServices();
    fetchClients();
  }, [fetchServices, fetchClients]);

  const service = id ? getServiceById(id) : null;
  const client = service?.client?.id ? getClientById(service.client.id) : null;

  if (isLoading) return <Spinner />;

  if (!service) {
    return (
      <NotFound
        message="Serviço não encontrado"
        backTo="/services"
        backLabel="Voltar para Serviços"
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4">
      <DetailPageHeader
        backTo="/services"
        title={service.furniture_name}
        description={
          client?.name ? `Cliente: ${client.name}` : 'Cliente não identificado'
        }
        actions={[
          {
            label: 'Editar',
            icon: <Pencil size={18} />,
            onClick: () => navigate(`/services/${service.id}/edit`),
            variant: 'secondary',
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={18} />,
            onClick: () => deleteModal.open(service),
            variant: 'danger',
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="card-base">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <h3 className="font-bold text-slate-800">
                  Detalhamento Financeiro
                </h3>
              </div>
              <StatusBadge status={service.status} />
            </div>

            <div className="p-6">
              <div className="grid gap-y-4">
                <InfoRow
                  label="Tecido"
                  value={formatCurrency(service.cost_fabric)}
                />
                <InfoRow
                  label="Espuma"
                  value={formatCurrency(service.cost_foam)}
                />
                <InfoRow
                  label="Mão de Obra"
                  value={formatCurrency(service.cost_labor)}
                />
                <InfoRow
                  label="Frete"
                  value={formatCurrency(service.cost_shipping)}
                />
                <InfoRow
                  label="Outros"
                  value={formatCurrency(service.cost_other)}
                />

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="mb-1 text-xs font-medium text-slate-500 uppercase">
                      Custo Total
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(service.total_cost)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="mb-1 text-xs font-medium text-blue-600 uppercase">
                      Preço Final
                    </p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(service.final_price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-emerald-500 p-4 text-white shadow-lg shadow-emerald-100">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} />
                    <div>
                      <p className="text-xs font-medium uppercase opacity-80">
                        Lucro Líquido Esperado
                      </p>
                      <p className="text-2xl font-black">
                        {formatCurrency(service.net_profit)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase opacity-80">
                      Margem
                    </p>
                    <p className="text-lg font-bold">
                      {(
                        (service.net_profit / service.final_price) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card-base p-6">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Scissors size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Tecido</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                  Material Selecionado
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {service.fabric_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {service.fabric_code || 'Sem código'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                <div>
                  <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                    Preço/m
                  </label>
                  <p className="font-bold text-slate-800">
                    {formatCurrency(service.fabric_price_per_meter)}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                    Quantidade
                  </label>
                  <p className="font-bold text-slate-800">
                    {service.fabric_meters}m
                  </p>
                </div>
              </div>
            </div>
          </section>

          {service.notes && (
            <div className="card-base p-6">
              <div className="mb-4 flex items-center gap-2 text-slate-400">
                <FileText size={18} />
                <h4 className="text-sm font-bold tracking-wider uppercase">
                  Observações
                </h4>
              </div>
              <p className="border-l-4 border-slate-100 pl-4 leading-relaxed wrap-break-word text-slate-600 italic">
                "{service.notes}"
              </p>
            </div>
          )}
        </aside>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        isLoading={deleteModal.isLoading}
        description={`Esta ação não pode ser desfeita. Deseja excluir permanentemente o serviço: ${service.furniture_name}?`}
      />
    </div>
  );
}
