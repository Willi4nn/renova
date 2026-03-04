import { formatCurrency } from '../utils/formatters';

export const ANIMATION_DURATION = 800;

export const AXIS_TICK = {
  fill: '#94a3b8',
  fontSize: 11,
  fontWeight: 500,
};

export const SHARED_TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    fontSize: '13px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
    padding: '10px 14px',
  },
  itemStyle: {
    color: '#1e293b',
    fontWeight: 600,
    padding: '2px 0',
  },
  labelStyle: {
    color: '#94a3b8',
    fontWeight: 600,
    marginBottom: '6px',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
};

export const formatK = (val: number) =>
  `R$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;

export const formatVal = (val: number | string) =>
  formatCurrency(Number(val) || 0);

export const calcPercentage = (val: number | string, total: number): string =>
  total > 0
    ? `${(((Number(val) || 0) / total) * 100).toFixed(1)}% do total`
    : '—';
