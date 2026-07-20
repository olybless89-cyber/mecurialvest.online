import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, AppError, NotFoundError } from '../types';
import { sendSuccess, parsePagination, getPaginationMeta } from '../utils/apiResponse';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import { createAuditLog } from '../middleware/auditLog';
import { AuditAction, AccountType } from '@prisma/client';

export const getAccounts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.user.userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
  sendSuccess(res, accounts, 'Accounts retrieved');
};

export const getAccountById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const account = await prisma.account.findFirst({
    where: { id, userId: req.user.userId },
  });
  if (!account) throw new NotFoundError('Account');
  sendSuccess(res, account, 'Account retrieved');
};

export const createAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { type, nickname, currency } = req.body;

  const count = await prisma.account.count({ where: { userId: req.user.userId } });
  if (count >= 5) throw new AppError('Maximum 5 accounts allowed', 400);

  const accountNumber = await generateAccountNumber();
  const account = await prisma.account.create({
    data: {
      userId: req.user.userId,
      accountNumber,
      type: type as AccountType,
      nickname,
      currency: currency || 'USD',
    },
  });

  await createAuditLog({ userId: req.user.userId, action: AuditAction.ACCOUNT_CREATE, resource: 'Account', resourceId: account.id });
  sendSuccess(res, account, 'Account created', 201);
};

export const updateAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nickname, isDefault } = req.body;

  const account = await prisma.account.findFirst({ where: { id, userId: req.user.userId } });
  if (!account) throw new NotFoundError('Account');

  if (isDefault) {
    await prisma.account.updateMany({ where: { userId: req.user.userId }, data: { isDefault: false } });
  }

  const updated = await prisma.account.update({
    where: { id },
    data: { ...(nickname !== undefined && { nickname }), ...(isDefault !== undefined && { isDefault }) },
  });
  sendSuccess(res, updated, 'Account updated');
};

export const freezeAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const account = await prisma.account.findFirst({ where: { id, userId: req.user.userId } });
  if (!account) throw new NotFoundError('Account');
  if (account.status === 'FROZEN') throw new AppError('Account is already frozen', 400);

  const updated = await prisma.account.update({ where: { id }, data: { status: 'FROZEN' } });
  await createAuditLog({ userId: req.user.userId, action: AuditAction.ACCOUNT_FREEZE, resource: 'Account', resourceId: id });
  sendSuccess(res, updated, 'Account frozen');
};

export const unfreezeAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const account = await prisma.account.findFirst({ where: { id, userId: req.user.userId } });
  if (!account) throw new NotFoundError('Account');
  if (account.status !== 'FROZEN') throw new AppError('Account is not frozen', 400);

  const updated = await prisma.account.update({ where: { id }, data: { status: 'ACTIVE' } });
  sendSuccess(res, updated, 'Account unfrozen');
};

export const getAccountStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.user.userId },
    select: { id: true, type: true, balance: true, currency: true, status: true },
  });

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: req.user.userId, type: 'CREDIT', status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: req.user.userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  sendSuccess(res, {
    accounts,
    totalBalance,
    monthlyIncome: Number(incomeResult._sum.amount || 0),
    monthlyExpenses: Number(expenseResult._sum.amount || 0),
  }, 'Stats retrieved');
};

export const getAccountTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);

  const account = await prisma.account.findFirst({ where: { id, userId: req.user.userId } });
  if (!account) throw new NotFoundError('Account');

  const where = {
    OR: [{ debitAccountId: id }, { creditAccountId: id }],
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.transaction.count({ where }),
  ]);

  sendSuccess(res, transactions, 'Transactions retrieved', 200, getPaginationMeta(total, page, limit));
};
