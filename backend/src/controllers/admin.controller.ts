import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, AppError, NotFoundError } from '../types';
import { sendSuccess, parsePagination, getPaginationMeta } from '../utils/apiResponse';
import { createAuditLog } from '../middleware/auditLog';
import { AuditAction, Prisma } from '@prisma/client';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalUsers, activeUsers, newUsersThisMonth, newUsersPrevMonth,
    totalAccounts, totalTransactions, monthlyVolume, prevMonthVolume,
    pendingTransactions, totalBalance,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfMonth } } }),
    prisma.account.count(),
    prisma.transaction.count(),
    prisma.transaction.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: startOfPrevMonth, lt: startOfMonth } }, _sum: { amount: true } }),
    prisma.transaction.count({ where: { status: 'PENDING' } }),
    prisma.account.aggregate({ _sum: { balance: true } }),
  ]);

  const monthlyVol = Number(monthlyVolume._sum.amount || 0);
  const prevVol = Number(prevMonthVolume._sum.amount || 0);
  const volumeGrowth = prevVol > 0 ? ((monthlyVol - prevVol) / prevVol) * 100 : 0;
  const userGrowth = newUsersPrevMonth > 0 ? ((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100 : 0;

  sendSuccess(res, {
    users: { total: totalUsers, active: activeUsers, newThisMonth: newUsersThisMonth, growth: userGrowth },
    accounts: { total: totalAccounts, totalBalance: Number(totalBalance._sum.balance || 0) },
    transactions: { total: totalTransactions, pending: pendingTransactions, monthlyVolume: monthlyVol, volumeGrowth },
  }, 'Dashboard stats retrieved');
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
  const { search, role, isActive } = req.query as Record<string, string>;

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(role && { role: role as Prisma.EnumRoleFilter }),
    ...(isActive !== undefined && { isActive: isActive === 'true' }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true,
        isActive: true, isEmailVerified: true, lastLoginAt: true, createdAt: true,
        _count: { select: { accounts: true, transactions: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  sendSuccess(res, users, 'Users retrieved', 200, getPaginationMeta(total, page, limit));
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true,
      role: true, isActive: true, isEmailVerified: true, lastLoginAt: true, lastLoginIp: true,
      createdAt: true, updatedAt: true,
      accounts: { orderBy: { isDefault: 'desc' } },
      _count: { select: { transactions: true, notifications: true } },
    },
  });
  if (!user) throw new NotFoundError('User');
  sendSuccess(res, user, 'User retrieved');
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isActive, role } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User');
  if (user.id === req.user.userId) throw new AppError('Cannot modify your own account', 400);

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(role !== undefined && { role }),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
  });

  await createAuditLog({
    userId: req.user.userId, action: AuditAction.ADMIN_USER_UPDATE,
    resource: 'User', resourceId: id,
    details: { changes: { isActive, role } },
    ipAddress: req.ip,
  });

  sendSuccess(res, updated, 'User updated');
};

export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
  const { type, status, startDate, endDate, userId } = req.query as Record<string, string>;

  const where: Prisma.TransactionWhereInput = {
    ...(type && { type: type as Prisma.EnumTransactionTypeFilter }),
    ...(status && { status: status as Prisma.EnumTransactionStatusFilter }),
    ...(userId && { userId }),
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    } : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        debitAccount: { select: { accountNumber: true } },
        creditAccount: { select: { accountNumber: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  sendSuccess(res, transactions, 'Transactions retrieved', 200, getPaginationMeta(total, page, limit));
};

export const reverseTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { reason } = req.body;

  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { debitAccount: true, creditAccount: true },
  });
  if (!tx) throw new NotFoundError('Transaction');
  if (tx.status !== 'COMPLETED') throw new AppError('Only completed transactions can be reversed', 400);
  if (tx.reversedAt) throw new AppError('Transaction already reversed', 400);
  if (tx.type !== 'TRANSFER' && tx.type !== 'DEBIT') throw new AppError('Only transfers and debits can be reversed', 400);

  await prisma.$transaction(async (prismaT) => {
    await prismaT.transaction.update({
      where: { id },
      data: { status: 'REVERSED', reversedAt: new Date(), reversedById: req.user.userId },
    });
    if (tx.debitAccountId && tx.creditAccountId) {
      await prismaT.account.update({ where: { id: tx.debitAccountId }, data: { balance: { increment: Number(tx.amount) } } });
      await prismaT.account.update({ where: { id: tx.creditAccountId }, data: { balance: { decrement: Number(tx.amount) } } });
    }
    if (tx.userId) {
      await prismaT.notification.create({
        data: {
          userId: tx.userId, type: 'TRANSACTION', title: 'Transaction Reversed',
          message: `Transaction ${tx.reference} has been reversed by admin. Reason: ${reason}`,
        },
      });
    }
  });

  await createAuditLog({
    userId: req.user.userId, action: AuditAction.ADMIN_TRANSACTION_REVERSE,
    resource: 'Transaction', resourceId: id, details: { reason },
    ipAddress: req.ip,
  });

  sendSuccess(res, null, 'Transaction reversed successfully');
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
  const { userId, action, startDate, endDate } = req.query as Record<string, string>;

  const where: Prisma.AuditLogWhereInput = {
    ...(userId && { userId }),
    ...(action && { action: action as Prisma.EnumAuditActionFilter }),
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    } : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  sendSuccess(res, logs, 'Audit logs retrieved', 200, getPaginationMeta(total, page, limit));
};
