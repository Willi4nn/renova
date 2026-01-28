import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateOrderInput,
  UpdateOrderInput,
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

export interface OrderCalculationInput {
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

export const calculateOrderValues = (
  data: OrderCalculationInput,
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

export const orderService = {
  async getAll() {
    return prisma.order.findMany({
      include: { client: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' },
    });
  },

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!order) throw new AppError('Ordem não encontrada', 404);
    return order;
  },

  async create(data: CreateOrderInput) {
    const clientExists = await prisma.client.findUnique({
      where: { id: data.client_id },
    });
    if (!clientExists) throw new AppError('Cliente não existe', 404);

    const calculatedFields = calculateOrderValues(data);

    const createData = removeUndefinedFields({
      ...data,
      ...calculatedFields,
      fabric_code: data.fabric_code ?? null,
      notes: data.notes ?? null,
      delivery_date: data.delivery_date ?? null,
    }) as Prisma.OrderUncheckedCreateInput;

    return prisma.order.create({ data: createData });
  },

  async update(id: string, data: UpdateOrderInput) {
    const currentOrder = await prisma.order.findUnique({ where: { id } });
    if (!currentOrder) throw new AppError('Ordem não encontrada', 404);

    if (data.client_id && data.client_id !== currentOrder.client_id) {
      const clientExists = await prisma.client.findUnique({
        where: { id: data.client_id },
      });
      if (!clientExists)
        throw new AppError('O novo cliente selecionado não existe', 404);
    }

    const calculationInput: OrderCalculationInput = {
      fabric_price_per_meter:
        data.fabric_price_per_meter ?? currentOrder.fabric_price_per_meter,
      fabric_meters: data.fabric_meters ?? currentOrder.fabric_meters,
      cost_foam: data.cost_foam ?? currentOrder.cost_foam,
      cost_shipping: data.cost_shipping ?? currentOrder.cost_shipping,
      cost_other: data.cost_other ?? currentOrder.cost_other,
      cost_labor: data.cost_labor ?? currentOrder.cost_labor,
    };

    const calculatedFields = calculateOrderValues(calculationInput);
    const updateData = removeUndefinedFields({
      ...data,
      ...calculatedFields,
    }) as Prisma.OrderUncheckedUpdateInput;

    return prisma.order.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    try {
      await prisma.order.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new AppError('Ordem não encontrada', 404);
        }
      }
      throw error;
    }
  },
};
