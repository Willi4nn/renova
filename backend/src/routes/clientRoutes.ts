import { Router } from 'express';
import { clientController } from '../controllers/clientController.js';
import { validateRequest } from '../middlewares/validator.js';
import {
  createClientSchema,
  updateClientSchema,
} from '../validators/schemas.js';

const clientRoutes = Router();
clientRoutes.get('/', clientController.index);
clientRoutes.get('/:id', clientController.show);
clientRoutes.post(
  '/',
  validateRequest(createClientSchema),
  clientController.store,
);
clientRoutes.put(
  '/:id',
  validateRequest(updateClientSchema),
  clientController.update,
);
clientRoutes.delete('/:id', clientController.destroy);

export { clientRoutes };
