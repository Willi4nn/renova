import {
  Calendar,
  DollarSign,
  FileText,
  Package,
  Pencil,
  Printer,
  Scissors,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/features/Modal/ConfirmDeleteModal';
import { PDFGenerationModal } from '../components/features/PDFGenerationModal';
import { NotFound } from '../components/layout/NotFound';
import { DetailPageHeader } from '../components/ui/DetailPageHeader';
import { InfoRow } from '../components/ui/InfoRow';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import type { Service } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateDocument } from '../utils/pdfGenerator';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getServiceById, fetchServices, removeService, isLoading } =
    useServiceStore();
  const { getClientById, fetchClients } = useClientStore();

  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

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
            label: 'Gerar Doc.',
            mobileLabel: 'PDF',
            icon: <Printer size={18} />,
            onClick: () => setIsPDFModalOpen(true),
            variant: 'secondary',
          },
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

      {/* lg:items-start previne que as colunas estiquem bizarramente no desktop */}
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* 1. SEÇÃO FINANCEIRA (SEMPRE TOPO ESQUERDO) */}
        <section className="w-full space-y-6 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <div className="card-base">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <h3 className="font-bold text-slate-800">
                  Detalhamento Financeiro
                </h3>
              </div>
              <div className="self-start sm:self-auto">
                <StatusBadge status={service.status} />
              </div>
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

                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
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

                <div className="flex flex-col justify-between gap-4 rounded-xl bg-emerald-500 p-4 text-white shadow-lg shadow-emerald-100 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase opacity-80">
                        Lucro Líquido Esperado
                      </p>
                      <p className="text-2xl font-black">
                        {formatCurrency(service.net_profit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end border-emerald-400/30">
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

        {/* 2. ASIDE TECIDO E DATAS (DIREITA NO DESKTOP, MEIO NO MOBILE) */}
        {/* Ele vai forçar ficar na coluna 3 e ocupar 2 linhas para acompanhar a altura do Financeiro */}
        <aside className="w-full space-y-6 lg:col-start-3 lg:row-span-2 lg:row-start-1">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <Package size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {service.fabric_name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {service.fabric_code || 'Sem código'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                    Preço/m
                  </label>
                  <p className="font-bold wrap-break-word text-slate-800">
                    {formatCurrency(service.fabric_price_per_meter)}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                    Quantidade
                  </label>
                  <p className="font-bold wrap-break-word text-slate-800">
                    {service.fabric_meters}m
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-base p-6">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                <Calendar size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Datas</h3>
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                  Data de Coleta
                </label>
                <p className="font-bold text-slate-800">
                  {formatDate(service.collection_date)}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black text-slate-400 uppercase">
                  Data de Entrega
                </label>
                <p className="font-bold text-slate-800">
                  {service.delivery_date
                    ? formatDate(service.delivery_date)
                    : 'Pendente'}
                </p>
              </div>
            </div>
          </section>
        </aside>

        {service.notes && (
          <section className="order-3 w-full min-w-0 lg:order-0 lg:col-span-2 lg:col-start-1 lg:row-start-2">
            <div className="card-base p-6">
              <div className="mb-4 flex items-center gap-2 text-slate-400">
                <FileText size={18} className="shrink-0" />
                <h4 className="text-sm font-bold tracking-wider uppercase">
                  Observações
                </h4>
              </div>
              <div className="w-full">
                <p className="border-l-4 border-slate-100 pl-4 text-sm leading-relaxed wrap-break-word [word-break:break-word] whitespace-pre-wrap text-slate-600 italic sm:text-base">
                  {service.notes}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        isLoading={deleteModal.isLoading}
        description={`Esta ação não pode ser desfeita. Deseja excluir permanentemente o serviço: ${service.furniture_name}?`}
      />

      <PDFGenerationModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        onGenerate={(type) => {
          if (service) {
            generateDocument(type, service, client || null);
            setIsPDFModalOpen(false);
          }
        }}
      />
    </div>
  );
}
