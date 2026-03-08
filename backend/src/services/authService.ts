import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { LoginInput, RegisterInput } from '../validators/schemas.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new AppError('E-mail já está em uso', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    return user;
  },

  async login({ email, password, rememberMe }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const daysValid = rememberMe ? 7 : 1;
    const maxAge = daysValid * 24 * 60 * 60 * 1000;

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '1d' },
    );

    // Salva o refresh token no banco para permitir revogação
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + maxAge),
      },
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
      maxAge,
    };
  },

  async revokeRefreshToken(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  },

  async refreshToken(token: string) {
    try {
      const { id, type } = jwt.verify(token, JWT_SECRET) as {
        id: string;
        type?: string;
      };

      if (type !== 'refresh') throw new Error();

      // Verifica se o token ainda existe no banco (não foi revogado)
      const stored = await prisma.refreshToken.findUnique({ where: { token } });
      if (!stored) throw new Error();

      if (!(await prisma.user.findUnique({ where: { id } }))) throw new Error();

      return {
        newAccessToken: jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' }),
      };
    } catch {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) throw new AppError('Usuário não encontrado', 404);
    return user;
  },
};
