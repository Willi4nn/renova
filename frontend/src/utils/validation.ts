import { z } from 'zod';

const isValidISODate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres')
    .trim(),
  phone_number: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 10 || val.length === 11, {
      message: 'Telefone inválido (deve ter 10 ou 11 dígitos)',
    }),
  address: z
    .string()
    .min(5, 'O endereço deve ter pelo menos 5 caracteres')
    .max(200, 'O endereço deve ter no máximo 200 caracteres')
    .trim(),
});

export const orderSchema = z.object({
  client_id: z.uuid('Selecione um cliente válido'),
  furniture_name: z.string().min(1, 'O nome do móvel é obrigatório').trim(),
  fabric_name: z.string().min(1, 'O nome do tecido é obrigatório').trim(),
  fabric_code: z.string().max(50, 'Código do tecido muito longo').optional(),
  fabric_price_per_meter: z.coerce
    .number()
    .min(0.01, 'O preço deve ser maior que zero'),
  fabric_meters: z.coerce
    .number()
    .min(0.01, 'A metragem deve ser maior que zero'),
  cost_foam: z.coerce.number().min(0, 'Custo não pode ser negativo'),
  cost_labor: z.coerce.number().min(0, 'Mão de obra não pode ser negativa'),
  cost_shipping: z.coerce.number().min(0, 'Frete não pode ser negativo'),
  cost_other: z.coerce.number().min(0, 'Outros custos não podem ser negativos'),
  collection_date: z
    .string()
    .min(1, 'A data de coleta é obrigatória')
    .refine(isValidISODate, {
      message: 'Data de coleta inválida. Use formato YYYY-MM-DD',
    }),
  delivery_date: z
    .string()
    .optional()
    .refine((date) => !date || isValidISODate(date), {
      message: 'Data de entrega inválida. Use formato YYYY-MM-DD',
    }),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'PAID']),
  notes: z.string().max(1000, 'A observação é muito longa').optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
