import type { CookieOptions, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { authService } from '../services/authService.js';

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar.',
  );
}

const cookieOpts: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const setAuthCookies = (
  res: Response,
  access: string,
  refresh: string,
  refreshMaxAge: number,
) => {
  res.cookie('token', access, { ...cookieOpts, maxAge: 15 * 60 * 1000 }); // 15 min
  res.cookie('refreshToken', refresh, { ...cookieOpts, maxAge: refreshMaxAge });
};

export const authController = {
  async register(req: Request, res: Response) {
    res.status(201).json(await authService.register(req.body));
  },

  async login(req: Request, res: Response) {
    const { user, accessToken, refreshToken, maxAge } = await authService.login(
      req.body,
    );
    setAuthCookies(res, accessToken, refreshToken, maxAge);
    res.json({ message: 'Login com sucesso', user });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    res
      .clearCookie('token', cookieOpts)
      .clearCookie('refreshToken', cookieOpts);
    res.json({ message: 'Logout efetuado' });
  },

  async refresh(req: Request, res: Response) {
    const oldRefresh = req.cookies.refreshToken;
    if (!oldRefresh) throw new AppError('Refresh token não fornecido', 401);

    const { newAccessToken } = await authService.refreshToken(oldRefresh);
    res.cookie('token', newAccessToken, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.json({ message: 'Token atualizado com sucesso' });
  },

  async me(req: AuthRequest, res: Response) {
    if (!req.user?.id) throw new AppError('Não autorizado', 401);
    res.json({ user: await authService.getMe(req.user.id) });
  },
};
