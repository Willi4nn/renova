import type { Response } from 'express';
import { AppError } from '../errors/AppError.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { serviceService } from '../services/serviceService.js';

export const serviceController = {
  async index(req: AuthRequest, res: Response) {
    const services = await serviceService.getAll(req.user!.id);
    return res.json(services);
  },

  async show(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do serviço é obrigatório');
    const service = await serviceService.getById(id, req.user!.id);
    return res.json(service);
  },

  async store(req: AuthRequest, res: Response) {
    const service = await serviceService.create(req.body, req.user!.id);
    return res.status(201).json(service);
  },

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do serviço é obrigatório');
    const service = await serviceService.update(id, req.body, req.user!.id);
    return res.json(service);
  },

  async destroy(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do serviço é obrigatório');
    await serviceService.delete(id, req.user!.id);
    return res.status(204).send();
  },
};
