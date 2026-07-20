import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, AppError, NotFoundError } from '../types';
import { sendSuccess } from '../utils/apiResponse';
import { createAuditLog } from '../middleware/auditLog';
import { AuditAction } from '@prisma/client';

export const getBeneficiaries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const beneficiaries = await prisma.beneficiary.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, beneficiaries, 'Beneficiaries retrieved');
};

export const addBeneficiary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, accountNumber, bankName, bankCode, nickname } = req.body;

  const count = await prisma.beneficiary.count({ where: { userId: req.user.userId } });
  if (count >= 20) throw new AppError('Maximum 20 beneficiaries allowed', 400);

  const existing = await prisma.beneficiary.findFirst({
    where: { userId: req.user.userId, accountNumber },
  });
  if (existing) throw new AppError('Beneficiary with this account number already exists', 409);

  // Check if internal account
  const internalAccount = await prisma.account.findFirst({ where: { accountNumber } });
  const isInternal = !!internalAccount;

  const beneficiary = await prisma.beneficiary.create({
    data: {
      userId: req.user.userId,
      name,
      accountNumber,
      bankName: bankName || (isInternal ? 'NexBank' : bankName),
      bankCode,
      nickname,
      isInternal,
    },
  });

  await createAuditLog({
    userId: req.user.userId, action: AuditAction.BENEFICIARY_ADD,
    resource: 'Beneficiary', resourceId: beneficiary.id,
    details: { accountNumber, bankName },
  });

  sendSuccess(res, beneficiary, 'Beneficiary added', 201);
};

export const updateBeneficiary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, nickname, bankName, bankCode } = req.body;

  const beneficiary = await prisma.beneficiary.findFirst({ where: { id, userId: req.user.userId } });
  if (!beneficiary) throw new NotFoundError('Beneficiary');

  const updated = await prisma.beneficiary.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(nickname !== undefined && { nickname }),
      ...(bankName !== undefined && { bankName }),
      ...(bankCode !== undefined && { bankCode }),
    },
  });
  sendSuccess(res, updated, 'Beneficiary updated');
};

export const deleteBeneficiary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const beneficiary = await prisma.beneficiary.findFirst({ where: { id, userId: req.user.userId } });
  if (!beneficiary) throw new NotFoundError('Beneficiary');

  await prisma.beneficiary.delete({ where: { id } });
  await createAuditLog({
    userId: req.user.userId, action: AuditAction.BENEFICIARY_REMOVE,
    resource: 'Beneficiary', resourceId: id,
  });
  sendSuccess(res, null, 'Beneficiary removed');
};
