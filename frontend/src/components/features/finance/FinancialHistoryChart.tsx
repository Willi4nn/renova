import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ANIMATION_DURATION,
  AXIS_TICK,
  formatK,
  formatVal,
  SHARED_TOOLTIP_STYLES,
} from '../../../constants/financeConstants';
import { ChartCard } from './ChartCard';
import type { MonthlyData } from './CostDistributionChart';

const COLORS = {
  receita: '#22c55e',
  custo: '#f43f5e',
  lucro: '#6366f1',
};

const SHARED_AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tick: AXIS_TICK,
};

const SHARED_CHART_PROPS = {
  type: 'monotone' as const,
  animationDuration: ANIMATION_DURATION,
};

const SHARED_AREA_PROPS = {
  ...SHARED_CHART_PROPS,
  strokeWidth: 0,
  legendType: 'none' as const,
  tooltipType: 'none' as const,
};

export function FinancialHistoryChart({
  monthlyData,
}: {
  monthlyData: MonthlyData[];
}) {
  return (
    <ChartCard
      title="Histórico Financeiro"
      description="Evolução de receita, custos e lucro no tempo."
      isEmpty={monthlyData.length === 0}
      emptyMessage="Sem dados para exibir neste período"
    >
      <ComposedChart
        data={monthlyData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.receita} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.receita} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.lucro} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.lucro} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />
        <XAxis dataKey="name" {...SHARED_AXIS_PROPS} dy={8} />
        <YAxis {...SHARED_AXIS_PROPS} tickFormatter={formatK} dx={-8} />

        <Tooltip
          formatter={(value: unknown, name: unknown) => [
            formatVal(value as number),
            String(name || ''),
          ]}
          cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
          {...SHARED_TOOLTIP_STYLES}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{
            paddingTop: '16px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        />

        <Area
          dataKey="receita"
          name="Receita"
          fill="url(#colorReceita)"
          {...SHARED_AREA_PROPS}
        />
        <Area
          dataKey="lucro"
          name="Lucro"
          fill="url(#colorLucro)"
          {...SHARED_AREA_PROPS}
        />

        <Line
          dataKey="receita"
          name="Receita"
          stroke={COLORS.receita}
          strokeWidth={3}
          dot={{ fill: COLORS.receita, strokeWidth: 2, stroke: '#fff', r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          {...SHARED_CHART_PROPS}
        />
        <Line
          dataKey="custo"
          name="Custos"
          stroke={COLORS.custo}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: COLORS.custo, r: 3 }}
          {...SHARED_CHART_PROPS}
        />
        <Line
          dataKey="lucro"
          name="Lucro"
          stroke={COLORS.lucro}
          strokeWidth={3}
          dot={{ fill: COLORS.lucro, strokeWidth: 2, stroke: '#fff', r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          {...SHARED_CHART_PROPS}
        />
      </ComposedChart>
    </ChartCard>
  );
}
