import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { UpdateClientDTO } from '../types/index.js';

export const clientService = {
  async getAll() {
    return prisma.client.findMany({ orderBy: { name: 'asc' } });
  },

  async getById(id: string) {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) throw new AppError('Cliente não encontrado', 404);
    return client;
  },

  async create(data: { name: string; phone_number: string; address: string }) {
    const clientExists = await prisma.client.findFirst({
      where: { phone_number: data.phone_number },
    });
    if (clientExists)
      throw new AppError('Cliente já cadastrado com este telefone');

    return prisma.client.create({ data });
  },

  async update(id: string, data: UpdateClientDTO) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return prisma.client.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) throw new AppError('Cliente não encontrado', 404);

    return prisma.client.delete({ where: { id } });
  },
};
