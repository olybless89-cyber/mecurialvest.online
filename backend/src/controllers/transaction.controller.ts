import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AuthenticatedRequest, NotFoundError, AppError } from '../types';
import { sendSuccess, parsePagination, getPaginationMeta } from '../utils/apiResponse';

export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
  const { type, status, startDate, endDate, accountId, minAmount, maxAmount, category, search } = req.query as Record<string, string>;

  const where: Prisma.TransactionWhereInput = {
    userId: req.user.userId,
    ...(type && { type: type as Prisma.EnumTransactionTypeFilter }),
    ...(status && { status: status as Prisma.EnumTransactionStatusFilter }),
    ...(category && { category }),
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    } : {}),
    ...(minAmount || maxAmount ? {
      amount: {
        ...(minAmount && { gte: parseFloat(minAmount) }),
        ...(maxAmount && { lte: parseFloat(maxAmount) }),
      },
    } : {}),
    ...(accountId && {
      OR: [{ debitAccountId: accountId }, { creditAccountId: accountId }],
    }),
    ...(search && {
      OR: [
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        debitAccount: { select: { accountNumber: true, nickname: true, type: true } },
        creditAccount: { select: { accountNumber: true, nickname: true, type: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  sendSuccess(res, transactions, 'Transactions retrieved', 200, getPaginationMeta(total, page, limit));
};

export const getTransactionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const tx = await prisma.transaction.findFirst({
    where: { id, userId: req.user.userId },
    include: {
      debitAccount: { select: { accountNumber: true, nickname: true, type: true } },
      creditAccount: { select: { accountNumber: true, nickname: true, type: true } },
      transfer: true,
    },
  });
  if (!tx) throw new NotFoundError('Transaction');
  sendSuccess(res, tx, 'Transaction retrieved');
};

export const getTransactionSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { period = '30' } = req.query as { period: string };
  const days = Math.min(365, Math.max(7, parseInt(period)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [income, expenses, txCount, categoryBreakdown] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId: req.user.userId, type: 'CREDIT', status: 'COMPLETED', createdAt: { gte: since } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId: req.user.userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: since } },
      _sum: { amount: true },
    }),
    prisma.transaction.count({ where: { userId: req.user.userId, createdAt: { gte: since } } }),
    prisma.transaction.groupBy({
      by: ['category'],
      where: { userId: req.user.userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: since }, category: { not: null } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 8,
    }),
  ]);

  sendSuccess(res, {
    period: days,
    income: Number(income._sum.amount || 0),
    expenses: Number(expenses._sum.amount || 0),
    net: Number(income._sum.amount || 0) - Number(expenses._sum.amount || 0),
    transactionCount: txCount,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category || 'Other',
      amount: Number(c._sum.amount || 0),
    })),
  }, 'Summary retrieved');
};

export const getSpendingTrend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { months = '6' } = req.query as { months: string };
  const monthCount = Math.min(12, Math.max(1, parseInt(months)));
  const since = new Date();
  since.setMonth(since.getMonth() - monthCount);

  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.userId, status: 'COMPLETED', createdAt: { gte: since } },
    select: { type: true, amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by month
  const monthly: Record<string, { income: number; expenses: number; month: string }> = {};
  for (const tx of transactions) {
    const key = `${tx.createdAt.getFullYear()}-${String(tx.createdAt.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) monthly[key] = { income: 0, expenses: 0, month: key };
    if (tx.type === 'CREDIT') monthly[key].income += Number(tx.amount);
    if (tx.type === 'DEBIT') monthly[key].expenses += Number(tx.amount);
  }

  sendSuccess(res, Object.values(monthly), 'Spending trend retrieved');
};

export const exportTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { startDate, endDate, accountId } = req.query as Record<string, string>;

  const where: Prisma.TransactionWhereInput = {
    userId: req.user.userId,
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    } : {}),
    ...(accountId && { OR: [{ debitAccountId: accountId }, { creditAccountId: accountId }] }),
  };

  const count = await prisma.transaction.count({ where });
  if (count > 10000) throw new AppError('Export limit exceeded. Please narrow your date range.', 400);

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      reference: true, type: true, status: true, amount: true, currency: true,
      description: true, category: true, balanceBefore: true, balanceAfter: true, createdAt: true,
    },
  });

  const csv = [
    'Reference,Type,Status,Amount,Currency,Description,Category,Balance Before,Balance After,Date',
    ...transactions.map((t) =>
      [t.reference, t.type, t.status, t.amount, t.currency,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.category || '', t.balanceBefore, t.balanceAfter, t.createdAt.toISOString()].join(',')
    ),
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="transactions-${Date.now()}.csv"`);
  res.send(csv);
};
