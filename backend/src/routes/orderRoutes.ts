import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { validateRequest } from '../middlewares/validator.js';
import { createOrderSchema, updateOrderSchema } from '../validators/schemas.js';

const orderRoutes = Router();
orderRoutes.get('/', orderController.index);
orderRoutes.get('/:id', orderController.show);
orderRoutes.post(
  '/',
  validateRequest(createOrderSchema),
  orderController.store,
);
orderRoutes.put(
  '/:id',
  validateRequest(updateOrderSchema),
  orderController.update,
);
orderRoutes.delete('/:id', orderController.destroy);

export { orderRoutes };
