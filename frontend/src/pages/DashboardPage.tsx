import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Users,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientModal } from '../components/features/Modal/ClientModal';
import { ServiceTable } from '../components/features/ServiceTable/ServiceTable';
import { Button } from '../components/ui/Button';
import { MetricCard } from '../components/ui/MetricCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Spinner } from '../components/ui/Spinner';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import { formatCurrency } from '../utils/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    services,
    fetchServices,
    isLoading: isLoadingServices,
  } = useServiceStore();
  const {
    clients,
    fetchClients,
    isLoading: isLoadingClients,
  } = useClientStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchClients();
  }, [fetchServices, fetchClients]);

  const isLoading = isLoadingServices || isLoadingClients;

  const stats = useMemo(() => {
    const inProgress = services.filter((s) =>
      ['IN_PROGRESS', 'PENDING', 'WAITING_MATERIAL'].includes(s.status),
    ).length;

    const completed = services.filter((s) =>
      ['DELIVERED', 'PAID', 'FINISHED'].includes(s.status),
    ).length;

    const totalRevenue = services.reduce(
      (acc, s) => acc + Number(s.final_price || 0),
      0,
    );

    return {
      clientsCount: clients.length,
      inProgressCount: inProgress,
      completedCount: completed,
      totalRevenue,
    };
  }, [services, clients]);

  const recentServices = useMemo(() => {
    return [...services]
      .sort(
        (a, b) =>
          new Date(b.collection_date).getTime() -
          new Date(a.collection_date).getTime(),
      )
      .slice(0, 5);
  }, [services]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da estofaria"
        titleSize="text-3xl"
        action={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsModalOpen(true)}>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Novo Cliente</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/services/new')}>
              <div className="flex items-center gap-2">
                <Wrench size={18} />
                <span>Novo Serviço</span>
              </div>
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Receita Total"
              value={formatCurrency(stats.totalRevenue)}
              subtitle="Faturamento bruto"
              icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
              valueColor="text-emerald-600"
            />
            <MetricCard
              title="Em Andamento"
              value={stats.inProgressCount}
              subtitle="Serviços na oficina"
              icon={<Wrench className="h-5 w-5 text-amber-500" />}
              valueColor="text-amber-600"
            />
            <MetricCard
              title="Concluídos"
              value={stats.completedCount}
              subtitle="Entregues ou pagos"
              icon={<CheckCircle className="h-5 w-5 text-blue-600" />}
              valueColor="text-blue-600"
            />
            <MetricCard
              title="Clientes"
              value={stats.clientsCount}
              subtitle="Total na base de dados"
              icon={<Users className="h-5 w-5 text-indigo-600" />}
              valueColor="text-indigo-600"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
                  Serviços Recentes
                </h2>
                <p className="text-sm text-slate-500">
                  Últimos serviços registrados no sistema
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/services')}
                  className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Ver todos
                </button>
                <ArrowRight size={16} className="text-emerald-600" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <ServiceTable services={recentServices} />
            </div>
          </div>
        </>
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={'Novo Cliente'}
      />
    </div>
  );
}
