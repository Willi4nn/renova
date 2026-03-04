import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ANIMATION_DURATION,
  AXIS_TICK,
  calcPercentage,
  formatK,
  formatVal,
  SHARED_TOOLTIP_STYLES,
} from '../../../constants/financeConstants';
import { ChartCard } from './ChartCard';

export interface MonthlyData {
  name: string;
  receita: number;
  custo: number;
  lucro: number;
}

export interface CostData {
  name: string;
  value: number;
}

const COST_COLORS: Record<string, string> = {
  Tecido: '#60a5fa',
  'Mão de Obra': '#fb7185',
  Espuma: '#34d399',
  Frete: '#fb923c',
  Outros: '#c084fc',
};

const SHARED_AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tick: AXIS_TICK,
};

export function CostDistributionChart({
  costDistribution,
  totalCosts,
}: {
  costDistribution: CostData[];
  totalCosts: number;
}) {
  return (
    <ChartCard
      title="Distribuição de Custos"
      description="Onde o dinheiro está sendo gasto na operação."
      isEmpty={costDistribution.length === 0}
      emptyMessage="Sem custos registrados no período"
    >
      <BarChart
        data={costDistribution}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#f1f5f9"
        />
        <XAxis type="number" {...SHARED_AXIS_PROPS} tickFormatter={formatK} />
        <YAxis
          type="category"
          dataKey="name"
          {...SHARED_AXIS_PROPS}
          width={90}
        />

        <Tooltip
          formatter={(val: unknown) => [
            formatVal(val as number),
            calcPercentage(val as number, totalCosts),
          ]}
          cursor={{ fill: '#f8fafc' }}
          {...SHARED_TOOLTIP_STYLES}
        />

        <Bar
          dataKey="value"
          radius={[0, 8, 8, 0]}
          animationDuration={ANIMATION_DURATION}
          label={{
            position: 'right',
            formatter: (val: unknown) => (val ? formatVal(val as number) : ''),
            fill: '#475569',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {costDistribution.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COST_COLORS[entry.name] || '#64748b'}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
