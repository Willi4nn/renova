import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validator.js';
import { loginSchema, registerSchema } from '../validators/schemas.js';

const router = Router();

// Limite de taxa para registro e login (Proteção contra DDOS)
const createLimiter = (minutes: number, max: number, errorMsg: string) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    message: { error: errorMsg },
    standardHeaders: true,
    legacyHeaders: false,
  });

router.post(
  '/register',
  createLimiter(60, 5, 'Muitas contas criadas. Aguarde 1 hora.'),
  validateRequest(registerSchema),
  authController.register,
);

router.post(
  '/login',
  createLimiter(15, 10, 'Muitas tentativas. Aguarde 15 minutos.'),
  validateRequest(loginSchema),
  authController.login,
);

router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);

export default router;
