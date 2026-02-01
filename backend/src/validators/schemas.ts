import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  phone_number: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Telefone deve ter 10 ou 11 dígitos (DDD + número)',
    }),
  address: z.string().min(5, 'Endereço muito curto'),
});

export const updateClientSchema = createClientSchema.partial();

export const createServiceSchema = z.object({
  client_id: z.uuid('ID do cliente inválido'),
  furniture_name: z.string().min(1),
  fabric_name: z.string().min(1),
  fabric_code: z.string().optional(),
  fabric_price_per_meter: z.number().min(0),
  fabric_meters: z.number().min(0),
  cost_foam: z.number().min(0).default(0),
  cost_labor: z.number().min(0).default(0),
  cost_shipping: z.number().min(0).default(0),
  cost_other: z.number().min(0).default(0),
  collection_date: z
    .string()
    .min(1, 'Data de coleta é obrigatória')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Data de coleta inválida. Use formato ISO (YYYY-MM-DD)',
    }),
  delivery_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data de entrega inválida. Use formato ISO (YYYY-MM-DD)',
    }),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'PAID']),
  notes: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
