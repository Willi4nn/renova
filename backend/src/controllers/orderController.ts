import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { orderService } from '../services/orderService.js';

export const orderController = {
  async index(_req: Request, res: Response) {
    const orders = await orderService.getAll();
    return res.json(orders);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('ID da ordem é obrigatório');

    const order = await orderService.getById(id);
    return res.json(order);
  },

  async store(req: Request, res: Response) {
    const order = await orderService.create(req.body);
    return res.status(201).json(order);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('ID da ordem é obrigatório');

    const order = await orderService.update(id, req.body);
    return res.json(order);
  },

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new AppError('ID da ordem é obrigatório');

    await orderService.delete(id);
    return res.status(204).send();
  },
};
