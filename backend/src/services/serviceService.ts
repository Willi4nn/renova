import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '../validators/schemas.js';

const roundMoney = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const toNumber = (value: number | Prisma.Decimal | null | undefined) =>
  Number(value ?? 0);

function removeUndefinedFields<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as T;
}

export interface ServiceCalculationInput {
  fabric_price_per_meter?: number | Prisma.Decimal | null;
  fabric_meters?: number | Prisma.Decimal | null;
  cost_foam?: number | Prisma.Decimal | null;
  cost_shipping?: number | Prisma.Decimal | null;
  cost_other?: number | Prisma.Decimal | null;
  cost_labor?: number | Prisma.Decimal | null;
}

export interface CalculatedValues {
  cost_fabric: number;
  total_cost: number;
  final_price: number;
  net_profit: number;
}

export const calculateServiceValues = (
  data: ServiceCalculationInput,
): CalculatedValues => {
  const cost_fabric = roundMoney(
    toNumber(data.fabric_price_per_meter) * toNumber(data.fabric_meters),
  );

  const total_cost = roundMoney(
    cost_fabric +
      toNumber(data.cost_foam) +
      toNumber(data.cost_shipping) +
      toNumber(data.cost_other),
  );

  const cost_labor = toNumber(data.cost_labor);
  const final_price = roundMoney(total_cost + cost_labor);
  const net_profit = roundMoney(final_price - total_cost);

  return { cost_fabric, total_cost, final_price, net_profit };
};

export const serviceService = {
  async getAll() {
    return prisma.service.findMany({
      include: { client: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' },
    });
  },

  async getById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!service) throw new AppError('Service not found', 404);
    return service;
  },

  async create(data: CreateServiceInput) {
    const clientExists = await prisma.client.findUnique({
      where: { id: data.client_id },
    });
    if (!clientExists) throw new AppError('Client does not exist', 404);

    const calculatedFields = calculateServiceValues(data);

    const createData = removeUndefinedFields({
      ...data,
      ...calculatedFields,
      fabric_code: data.fabric_code ?? null,
      notes: data.notes ?? null,
      delivery_date: data.delivery_date ?? null,
    }) as Prisma.ServiceUncheckedCreateInput;

    return prisma.service.create({ data: createData });
  },

  async update(id: string, data: UpdateServiceInput) {
    const currentService = await prisma.service.findUnique({ where: { id } });
    if (!currentService) throw new AppError('Service not found', 404);

    if (data.client_id && data.client_id !== currentService.client_id) {
      const clientExists = await prisma.client.findUnique({
        where: { id: data.client_id },
      });
      if (!clientExists)
        throw new AppError('The selected new client does not exist', 404);
    }

    const calculationInput: ServiceCalculationInput = {
      fabric_price_per_meter:
        data.fabric_price_per_meter ?? currentService.fabric_price_per_meter,
      fabric_meters: data.fabric_meters ?? currentService.fabric_meters,
      cost_foam: data.cost_foam ?? currentService.cost_foam,
      cost_shipping: data.cost_shipping ?? currentService.cost_shipping,
      cost_other: data.cost_other ?? currentService.cost_other,
      cost_labor: data.cost_labor ?? currentService.cost_labor,
    };

    const calculatedFields = calculateServiceValues(calculationInput);
    const updateData = removeUndefinedFields({
      ...data,
      ...calculatedFields,
    }) as Prisma.ServiceUncheckedUpdateInput;

    return prisma.service.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    try {
      await prisma.service.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new AppError('Service not found', 404);
        }
      }
      throw error;
    }
  },
};
