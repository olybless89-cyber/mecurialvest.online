import { Response, NextFunction } from 'express';
import { AuditAction } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const createAuditLog = async (opts: {
  userId?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) => {
  try {
    await prisma.auditLog.create({ data: opts });
  } catch (err) {
    logger.error('Failed to create audit log:', err);
  }
};

export const auditMiddleware = (action: AuditAction, resource?: string) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    await createAuditLog({
      userId: req.user?.userId,
      action,
      resource,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
    next();
  };
};
