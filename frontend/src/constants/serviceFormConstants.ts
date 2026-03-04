import type { ServiceFormData } from '../utils/validation';

export const toDateInputValue = (dateStr: string) =>
  new Date(dateStr).toISOString().split('T')[0];

/** Valor padrão para campos numéricos opcionais no formulário */
export const EMPTY_NUM = '' as unknown as number;

export type CostField = {
  label: string;
  name: keyof ServiceFormData;
  step?: string;
  placeholder?: string;
};

export const COST_FIELDS: CostField[] = [
  {
    label: 'Espuma (R$)',
    name: 'cost_foam',
    step: '0.01',
    placeholder: '0.00',
  },
  {
    label: 'Mão de Obra (R$)',
    name: 'cost_labor',
    step: '0.01',
    placeholder: '0.00',
  },
  {
    label: 'Frete (R$)',
    name: 'cost_shipping',
    step: '0.01',
    placeholder: '0.00',
  },
  {
    label: 'Outros (R$)',
    name: 'cost_other',
    step: '0.01',
    placeholder: '0.00',
  },
];
