import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { serviceService } from '../services/serviceService.js';

export const serviceController = {
  async index(_req: Request, res: Response) {
    const services = await serviceService.getAll();
    return res.json(services);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Service ID is required');

    const service = await serviceService.getById(id);
    return res.json(service);
  },

  async store(req: Request, res: Response) {
    const service = await serviceService.create(req.body);
    return res.status(201).json(service);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Service ID is required');

    const service = await serviceService.update(id, req.body);
    return res.json(service);
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Service ID is required');

    await serviceService.delete(id);
    return res.status(204).send();
  },
};
