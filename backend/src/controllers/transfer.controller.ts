import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, AppError, NotFoundError } from '../types';
import { sendSuccess, parsePagination, getPaginationMeta } from '../utils/apiResponse';
import { createAuditLog } from '../middleware/auditLog';
import { sendTransactionNotificationEmail } from '../config/email';
import { AuditAction, TransactionType, TransactionStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const initiateTransfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { fromAccountId, toAccountNumber, amount, note, currency = 'USD' } = req.body;
  const transferAmount = parseFloat(amount);

  if (isNaN(transferAmount) || transferAmount <= 0) throw new AppError('Invalid transfer amount', 400);
  if (transferAmount > 50000) throw new AppError('Single transfer limit is $50,000', 400);

  const fromAccount = await prisma.account.findFirst({
    where: { id: fromAccountId, userId: req.user.userId },
  });
  if (!fromAccount) throw new NotFoundError('Source account');
  if (fromAccount.status !== 'ACTIVE') throw new AppError('Source account is not active', 400);
  if (Number(fromAccount.balance) < transferAmount) throw new AppError('Insufficient funds', 400);

  const toAccount = await prisma.account.findFirst({
    where: { accountNumber: toAccountNumber, status: 'ACTIVE' },
    include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
  if (!toAccount) throw new NotFoundError('Destination account');
  if (toAccount.id === fromAccountId) throw new AppError('Cannot transfer to the same account', 400);

  const reference = uuidv4();

  const { transfer, transaction } = await prisma.$transaction(async (tx) => {
    const balanceBefore = Number(fromAccount.balance);
    const balanceAfter = balanceBefore - transferAmount;

    await tx.account.update({ where: { id: fromAccountId }, data: { balance: { decrement: transferAmount } } });
    await tx.account.update({ where: { id: toAccount.id }, data: { balance: { increment: transferAmount } } });

    const txRecord = await tx.transaction.create({
      data: {
        id: uuidv4(),
        userId: req.user.userId,
        debitAccountId: fromAccountId,
        creditAccountId: toAccount.id,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        amount: transferAmount,
        currency,
        reference,
        description: note || `Transfer to ${toAccount.accountNumber}`,
        balanceBefore,
        balanceAfter,
      },
    });

    const xfer = await tx.transfer.create({
      data: {
        id: uuidv4(),
        senderId: req.user.userId,
        receiverId: toAccount.userId,
        fromAccountId,
        toAccountId: toAccount.id,
        transactionId: txRecord.id,
        amount: transferAmount,
        currency,
        note,
        completedAt: new Date(),
      },
    });

    // Notifications
    await tx.notification.create({
      data: {
        userId: req.user.userId,
        type: 'TRANSACTION',
        title: 'Transfer Sent',
        message: `You sent ${currency} ${transferAmount.toFixed(2)} to account ${toAccount.accountNumber}.`,
        data: { transactionId: txRecord.id, amount: transferAmount },
      },
    });

    if (toAccount.userId !== req.user.userId) {
      await tx.notification.create({
        data: {
          userId: toAccount.userId,
          type: 'TRANSACTION',
          title: 'Transfer Received',
          message: `You received ${currency} ${transferAmount.toFixed(2)} in account ${toAccount.accountNumber}.`,
          data: { transactionId: txRecord.id, amount: transferAmount },
        },
      });
    }

    return { transfer: xfer, transaction: txRecord };
  });

  await createAuditLog({
    userId: req.user.userId,
    action: AuditAction.TRANSFER_COMPLETE,
    resource: 'Transfer',
    resourceId: transfer.id,
    details: { amount: transferAmount, fromAccountId, toAccountId: toAccount.id },
    ipAddress: req.ip,
  });

  // Send email notifications (non-blocking)
  const senderUser = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { firstName: true, email: true } });
  if (senderUser) {
    sendTransactionNotificationEmail(senderUser.email, senderUser.firstName, {
      type: 'debit', amount: `${currency} ${transferAmount.toFixed(2)}`,
      description: note || `Transfer to ${toAccount.accountNumber}`,
      balance: `${currency} ${(Number(fromAccount.balance) - transferAmount).toFixed(2)}`,
    });
  }

  sendSuccess(res, { transfer, transaction }, 'Transfer completed successfully', 201);
};

export const getTransfers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);

  const where = {
    OR: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
  };

  const [transfers, total] = await Promise.all([
    prisma.transfer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        fromAccount: { select: { accountNumber: true, nickname: true } },
        toAccount: { select: { accountNumber: true, nickname: true } },
        sender: { select: { firstName: true, lastName: true } },
        receiver: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.transfer.count({ where }),
  ]);

  sendSuccess(res, transfers, 'Transfers retrieved', 200, getPaginationMeta(total, page, limit));
};
