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

export const createServiceSchema = z
  .object({
    client_id: z.uuid('ID do cliente inválido'),
    furniture_name: z.string().min(1),
    fabric_name: z.string().min(1),
    fabric_code: z.string().optional(),
    fabric_price_per_meter: z.coerce.number().min(0),
    fabric_meters: z.coerce.number().min(0),
    cost_foam: z.coerce.number().min(0).default(0),
    cost_labor: z.coerce.number().min(0).default(0),
    cost_shipping: z.coerce.number().min(0).default(0),
    cost_other: z.coerce.number().min(0).default(0),
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
    notes: z.string().max(500, 'Observação muito longa').optional(),
  })
  .refine(
    (data) => {
      if (!data.delivery_date || !data.collection_date) return true;
      return new Date(data.delivery_date) >= new Date(data.collection_date);
    },
    {
      message: 'Data de entrega não pode ser anterior à data de coleta',
      path: ['delivery_date'],
    },
  )
  .refine(
    (data) => {
      if (['DELIVERED', 'PAID'].includes(data.status) && !data.delivery_date) {
        return false;
      }
      return true;
    },
    {
      message:
        'A data de entrega é obrigatória para os status Entregue ou Pago',
      path: ['delivery_date'],
    },
  );

export const updateServiceSchema = createServiceSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
