import {
  CircleDollarSign,
  DollarSign,
  Package,
  Percent,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { formatCurrency } from '../../../utils/formatters';

interface Metrics {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  ticketAvg: number;
  profitMargin: number;
  roi: number;
}

interface ComparisonData {
  revenueChange: number;
  costsChange: number;
  profitChange: number;
  hasComparison: boolean;
  prevRev: number;
  prevCost: number;
  prevProf: number;
}

const getMetricColor = (
  val: number,
  ok: number,
  good: number,
  count: number,
) => {
  if (count === 0) return 'text-slate-900';
  if (val >= good) return 'text-emerald-600';
  if (val >= ok) return 'text-slate-900';
  return 'text-red-600';
};

const getBadgeState = (
  prev: number,
  current: number,
  change: number,
  inverse: boolean,
) => {
  const colorGood = 'text-emerald-600';
  const colorBad = 'text-red-600';
  const colorNeutral = 'text-slate-400';

  if (prev === 0 && current === 0) return { text: '-', color: colorNeutral };
  if (prev > 0 && current === 0)
    return {
      text: 's/ movimento',
      color: colorNeutral,
      title: 'Sem movimento',
    };

  if (prev === 0 && current > 0) {
    return {
      text: inverse ? '100%' : '+100%',
      color: inverse ? colorBad : colorGood,
    };
  }

  const sign = change > 0 ? '+' : '';
  const text = `${sign}${change.toFixed(1)}%`;

  let color = colorNeutral;
  if (change > 0) color = inverse ? colorBad : colorGood;
  else if (change < 0) color = inverse ? colorGood : colorBad;

  return { text, color };
};

export function ComparisonBadge({
  change,
  prevVal,
  currentVal,
  hasComparison,
  inverseColors = false,
}: {
  change: number;
  prevVal: number;
  currentVal: number;
  hasComparison: boolean;
  inverseColors?: boolean;
}) {
  if (!hasComparison) return null;

  const { text, color, title } = getBadgeState(
    prevVal,
    currentVal,
    change,
    inverseColors,
  );

  return (
    <span className={`text-xs font-bold ${color}`} title={title}>
      {text}
    </span>
  );
}

export function MainKPICards({
  metrics,
  comparisonData: cmp,
}: {
  metrics: Metrics;
  comparisonData: ComparisonData;
}) {
  const cards = [
    {
      title: 'Receita Total',
      icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
      value: metrics.totalRevenue,
      subIcon: <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />,
      subText: 'Faturamento bruto',
      change: cmp.revenueChange,
      prev: cmp.prevRev,
      bgClass: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50',
    },
    {
      title: 'Custos Totais',
      icon: <Wallet className="h-8 w-8 text-red-600" />,
      value: metrics.totalCosts,
      subIcon: <TrendingDown className="mr-1 h-3 w-3 text-red-500" />,
      subText: 'Despesas e materiais',
      change: cmp.costsChange,
      prev: cmp.prevCost,
      inverseColors: true,
      bgClass: 'border-red-200 bg-red-50/50 hover:bg-red-50',
    },
    {
      title: 'Lucro Líquido',
      icon: <CircleDollarSign className="h-8 w-8 text-blue-600" />,
      value: metrics.totalProfit,
      subIcon: null,
      subText: 'Resultado final livre',
      change: cmp.profitChange,
      prev: cmp.prevProf,
      bgClass: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`group cursor-default rounded-xl border p-5 shadow-sm transition-colors ${card.bgClass}`}
        >
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-xs font-medium tracking-tight text-slate-500">
              {card.title}
            </h3>
            {card.icon}
          </div>

          <div className="text-2xl font-black text-slate-900">
            {formatCurrency(card.value)}
          </div>

          <div className="mt-1 flex items-center justify-between">
            <p className="flex items-center text-xs text-slate-500">
              {card.subIcon}
              {card.subText}
            </p>
            <ComparisonBadge
              change={card.change}
              prevVal={card.prev}
              currentVal={card.value}
              hasComparison={cmp.hasComparison}
              inverseColors={card.inverseColors}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SecondaryMetricsCards({
  metrics,
  servicesCount: count,
}: {
  metrics: Metrics;
  servicesCount: number;
}) {
  const hasData = count > 0;

  const cards = [
    {
      title: 'Ticket Médio',
      value: hasData ? formatCurrency(metrics.ticketAvg) : '-',
      subtitle: `${count} pedido${count === 1 ? '' : 's'}`,
      color: 'text-slate-900',
      icon: <Package className="h-5 w-5 text-slate-600" />,
    },
    {
      title: 'Margem de Lucro',
      value: hasData ? `${metrics.profitMargin.toFixed(1)}%` : '-',
      subtitle: 'Sobre receita total',
      color: getMetricColor(metrics.profitMargin, 15, 30, count),
      icon: <Percent className="h-5 w-5 text-slate-600" />,
    },
    {
      title: 'ROI',
      value: hasData ? `${metrics.roi.toFixed(1)}%` : '-',
      subtitle: 'Retorno investimento',
      color: getMetricColor(metrics.roi, 25, 50, count),
      icon: <TrendingUp className="h-5 w-5 text-slate-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="card-base group flex cursor-default items-center justify-between p-4 transition-colors hover:bg-slate-50/50"
        >
          <div>
            <p className="text-xs font-medium text-slate-500 group-hover:text-slate-600">
              {card.title}
            </p>
            <h4
              className={`mt-0.5 text-xl font-bold tracking-tight ${card.color}`}
            >
              {card.value}
            </h4>
            <p className="mt-0.5 text-xs text-slate-400">{card.subtitle}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors group-hover:bg-slate-200">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
