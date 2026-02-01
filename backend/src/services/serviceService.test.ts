import { afterEach, describe, expect, it, jest } from '@jest/globals';
import type { Service } from '../../generated/prisma/client.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { CreateServiceInput } from '../validators/schemas.js';
import { serviceService } from './serviceService.js';

describe('serviceService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws if client does not exist when creating', async () => {
    jest.spyOn(prisma.client, 'findUnique').mockResolvedValue(null);

    await expect(
      serviceService.create({ client_id: 'any-id' } as CreateServiceInput),
    ).rejects.toEqual(new AppError('Client does not exist', 404));
  });

  it('uses old values if not sent in update', async () => {
    const existingService = {
      id: 'service-123',
      fabric_price_per_meter: 50,
      fabric_meters: 10,
      cost_foam: 100,
      cost_labor: 400,
      cost_shipping: 0,
      cost_other: 0,
    };

    jest
      .spyOn(prisma.service, 'findUnique')
      .mockResolvedValue(existingService as unknown as Service);
    jest
      .spyOn(prisma.service, 'update')
      .mockResolvedValue({} as unknown as Service);

    await serviceService.update('service-123', { cost_foam: 200 });

    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: 'service-123' },
      data: expect.objectContaining({
        cost_foam: 200,
        total_cost: 700,
        final_price: 1100,
      }),
    });
  });
});
