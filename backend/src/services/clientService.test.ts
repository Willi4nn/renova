import { describe, expect, it, jest } from '@jest/globals';
import type { Client } from '../../generated/prisma/client.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import { clientService } from './clientService.js';

const mockClient = {
  name: 'Willian',
  phone_number: '34999998888',
  address: 'Patos de Minas',
};

describe('clientService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws if phone is already registered', async () => {
    jest.spyOn(prisma.client, 'findFirst').mockResolvedValue({
      id: '1',
      ...mockClient,
      created_at: new Date(),
    } as unknown as Client);

    await expect(clientService.create(mockClient)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('creates client if phone is new', async () => {
    jest.spyOn(prisma.client, 'findFirst').mockResolvedValue(null);

    jest.spyOn(prisma.client, 'create').mockResolvedValue({
      id: '2',
      ...mockClient,
      created_at: new Date(),
    } as unknown as Client);

    const result = await clientService.create(mockClient);
    expect(result).toHaveProperty('id');
  });
});
