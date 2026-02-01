import { Router } from 'express';
import { serviceController } from '../controllers/serviceController.js';
import { validateRequest } from '../middlewares/validator.js';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../validators/schemas.js';

const serviceRoutes = Router();
serviceRoutes.get('/', serviceController.index);
serviceRoutes.get('/:id', serviceController.show);
serviceRoutes.post(
  '/',
  validateRequest(createServiceSchema),
  serviceController.store,
);
serviceRoutes.put(
  '/:id',
  validateRequest(updateServiceSchema),
  serviceController.update,
);
serviceRoutes.delete('/:id', serviceController.destroy);

export { serviceRoutes };
