import type { Response } from 'express';
import { AppError } from '../errors/AppError.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { clientService } from '../services/clientService.js';

export const clientController = {
  async index(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const clients = await clientService.getAll(userId);
    return res.json(clients);
  },

  async show(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do cliente é obrigatório');
    const client = await clientService.getById(id, req.user!.id);
    return res.json(client);
  },

  async store(req: AuthRequest, res: Response) {
    const client = await clientService.create(req.body, req.user!.id);
    return res.status(201).json(client);
  },

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do cliente é obrigatório');
    const client = await clientService.update(id, req.body, req.user!.id);
    return res.json(client);
  },

  async destroy(req: AuthRequest, res: Response) {
    const { id } = req.params;
    if (!id) throw new AppError('ID do cliente é obrigatório');
    await clientService.delete(id, req.user!.id);
    return res.status(204).send();
  },
};
