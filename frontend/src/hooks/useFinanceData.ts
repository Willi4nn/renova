import { useMemo } from 'react';
import type { Service } from '../types';

export type PeriodFilter =
  | 'current_month'
  | 'last_month'
  | 'current_year'
  | 'all';

const MONTH_NAMES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const sumProp = (list: Service[], prop: keyof Service) =>
  list.reduce((sum, s) => sum + Number(s[prop] || 0), 0);

const getServiceDate = (s: Service) =>
  new Date(
    (s.status === 'DELIVERED' || s.status === 'PAID') && s.delivery_date
      ? s.delivery_date
      : s.collection_date,
  );

const isSameMonth = (d: Date, target: Date) =>
  d.getFullYear() === target.getFullYear() &&
  d.getMonth() === target.getMonth();

const isSameYear = (d: Date, year: number) => d.getFullYear() === year;

const calcChange = (current: number, previous: number) =>
  previous > 0 ? ((current - previous) / previous) * 100 : 0;

export function useFinanceData(
  services: Service[],
  periodFilter: PeriodFilter,
) {
  const { now, lastMonth, prevLastMonth } = useMemo(() => {
    const date = new Date();
    return {
      now: date,
      lastMonth: new Date(date.getFullYear(), date.getMonth() - 1),
      prevLastMonth: new Date(date.getFullYear(), date.getMonth() - 2),
    };
  }, []);

  // Service filter by period
  const filteredServices = useMemo(() => {
    if (periodFilter === 'all') return services;

    return services.filter((service) => {
      const date = getServiceDate(service);
      switch (periodFilter) {
        case 'current_month':
          return isSameMonth(date, now);
        case 'last_month':
          return isSameMonth(date, lastMonth);
        case 'current_year':
          return isSameYear(date, now.getFullYear());
        default:
          return true;
      }
    });
  }, [services, periodFilter, now, lastMonth]);

  // Main calculations (KPIs)
  const metrics = useMemo(() => {
    const totalRevenue = sumProp(filteredServices, 'final_price');
    const totalCosts = sumProp(filteredServices, 'total_cost');
    const totalProfit = sumProp(filteredServices, 'net_profit');

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      ticketAvg: filteredServices.length
        ? totalRevenue / filteredServices.length
        : 0,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      roi: totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0,
    };
  }, [filteredServices]);

  // Percentage comparison with the previous period
  const comparisonData = useMemo(() => {
    if (periodFilter === 'all' || services.length === 0) {
      return {
        revenueChange: 0,
        costsChange: 0,
        profitChange: 0,
        hasComparison: false,
        prevRev: 0,
        prevCost: 0,
        prevProf: 0,
      };
    }

    const previousServices = services.filter((s) => {
      const date = getServiceDate(s);
      switch (periodFilter) {
        case 'current_month':
          return isSameMonth(date, lastMonth);
        case 'last_month':
          return isSameMonth(date, prevLastMonth);
        case 'current_year':
          return isSameYear(date, now.getFullYear() - 1);
        default:
          return false;
      }
    });

    const prevRev = sumProp(previousServices, 'final_price');
    const prevCost = sumProp(previousServices, 'total_cost');
    const prevProf = sumProp(previousServices, 'net_profit');

    return {
      revenueChange: calcChange(metrics.totalRevenue, prevRev),
      costsChange: calcChange(metrics.totalCosts, prevCost),
      profitChange: calcChange(metrics.totalProfit, prevProf),
      hasComparison: previousServices.length > 0 || filteredServices.length > 0,
      prevRev,
      prevCost,
      prevProf,
    };
  }, [
    periodFilter,
    services,
    metrics.totalRevenue,
    metrics.totalCosts,
    metrics.totalProfit,
    filteredServices.length,
    lastMonth,
    prevLastMonth,
    now,
  ]);

  // Financial History
  const monthlyData = useMemo(() => {
    const grouped = filteredServices.reduce(
      (acc, order) => {
        const date = getServiceDate(order);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        if (!acc[key]) {
          acc[key] = {
            name: `${MONTH_NAMES[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`,
            receita: 0,
            custo: 0,
            lucro: 0,
            order: date.getTime(),
          };
        }

        acc[key].receita += Number(order.final_price || 0);
        acc[key].custo += Number(order.total_cost || 0);
        acc[key].lucro += Number(order.net_profit || 0);

        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          receita: number;
          custo: number;
          lucro: number;
          order: number;
        }
      >,
    );

    return Object.values(grouped)
      .sort((a, b) => a.order - b.order)
      .map(({ order: _, ...rest }) => rest);
  }, [filteredServices]);

  // Cost distribution
  const costDistribution = useMemo(
    () =>
      [
        { name: 'Tecido', value: sumProp(filteredServices, 'cost_fabric') },
        { name: 'Mão de Obra', value: sumProp(filteredServices, 'cost_labor') },
        { name: 'Espuma', value: sumProp(filteredServices, 'cost_foam') },
        { name: 'Frete', value: sumProp(filteredServices, 'cost_shipping') },
        { name: 'Outros', value: sumProp(filteredServices, 'cost_other') },
      ].filter((i) => i.value > 0),
    [filteredServices],
  );

  return {
    filteredServices,
    metrics,
    comparisonData,
    monthlyData,
    costDistribution,
  };
}
