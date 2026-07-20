import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types';
import { UnauthorizedError } from '../types';

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(new UnauthorizedError('Account not found or inactive'));
    }

    req.user = { userId: user.id, email: user.email, role: user.role };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
