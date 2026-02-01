import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { clientService } from '../services/clientService.js';

export const clientController = {
  async index(_req: Request, res: Response) {
    const clients = await clientService.getAll();
    return res.json(clients);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Client ID is required');

    const client = await clientService.getById(id);
    return res.json(client);
  },

  async store(req: Request, res: Response) {
    const client = await clientService.create(req.body);
    return res.status(201).json(client);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Client ID is required');

    const client = await clientService.update(id, req.body);
    return res.json(client);
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('Client ID is required');

    await clientService.delete(id);
    return res.status(204).send();
  },
};
