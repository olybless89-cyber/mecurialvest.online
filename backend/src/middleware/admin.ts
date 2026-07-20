import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ForbiddenError } from '../types';

export const requireAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return next(new ForbiddenError('Super admin access required'));
  }
  next();
};
