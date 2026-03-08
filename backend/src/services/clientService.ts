import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { UpdateClientDTO } from '../types/index.js';

export const clientService = {
  async getAll(userId: string) {
    return prisma.client.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: string, userId: string) {
    const client = await prisma.client.findFirst({
      where: { id, user_id: userId },
    });
    if (!client) throw new AppError('Cliente não encontrado', 404);
    return client;
  },

  async create(
    data: { name: string; phone_number: string; address: string },
    userId: string,
  ) {
    // Verifica duplicação de telefone apenas no mesmo usuário
    const clientExists = await prisma.client.findFirst({
      where: { phone_number: data.phone_number, user_id: userId },
    });
    if (clientExists)
      throw new AppError('Número de telefone já registrado para outro cliente');

    return prisma.client.create({ data: { ...data, user_id: userId } });
  },

  async update(id: string, data: UpdateClientDTO, userId: string) {
    const client = await prisma.client.findFirst({
      where: { id, user_id: userId },
    });
    if (!client) throw new AppError('Cliente não encontrado', 404);

    if (data.phone_number && data.phone_number !== client.phone_number) {
      const phoneExists = await prisma.client.findFirst({
        where: {
          phone_number: data.phone_number,
          user_id: userId,
          NOT: { id },
        },
      });
      if (phoneExists) {
        throw new AppError(
          'Número de telefone já registrado para outro cliente',
        );
      }
    }

    return prisma.client.update({ where: { id }, data });
  },

  async delete(id: string, userId: string) {
    const client = await prisma.client.findFirst({
      where: { id, user_id: userId },
    });
    if (!client) throw new AppError('Cliente não encontrado', 404);

    return prisma.client.delete({ where: { id } });
  },
};
