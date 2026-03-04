import { useEffect, useState } from 'react';

import { CostDistributionChart } from '../components/features/finance/CostDistributionChart';
import {
  MainKPICards,
  SecondaryMetricsCards,
} from '../components/features/finance/FinancialCards';
import { FinancialHistoryChart } from '../components/features/finance/FinancialHistoryChart';
import { Spinner } from '../components/ui/Spinner';
import { useFinanceData, type PeriodFilter } from '../hooks/useFinanceData';
import { useServiceStore } from '../store/useServiceStore';
import { cn } from '../utils/cn';

const FILTER_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'current_month', label: 'Este Mês' },
  { value: 'last_month', label: 'Mês Passado' },
  { value: 'current_year', label: 'Este Ano' },
  { value: 'all', label: 'Todo Período' },
];

export function FinancePage() {
  const { services, fetchServices, isLoading } = useServiceStore();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const {
    filteredServices,
    metrics,
    comparisonData,
    monthlyData,
    costDistribution,
  } = useFinanceData(services, periodFilter);

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-in fade-in space-y-5 duration-500">
      <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Financeiro
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Visão geral de desempenho e rentabilidade.
          </p>
        </div>

        <div className="flex w-full overflow-x-auto rounded-lg bg-slate-100 p-1 sm:w-auto">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriodFilter(opt.value)}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:flex-none',
                periodFilter === opt.value
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <MainKPICards metrics={metrics} comparisonData={comparisonData} />
      <SecondaryMetricsCards
        metrics={metrics}
        servicesCount={filteredServices.length}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FinancialHistoryChart monthlyData={monthlyData} />
        <CostDistributionChart
          costDistribution={costDistribution}
          totalCosts={metrics.totalCosts}
        />
      </div>
    </div>
  );
}
