import { Response } from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database';
import { AuthenticatedRequest, AppError } from '../types';
import { sendSuccess } from '../utils/apiResponse';
import { createAuditLog } from '../middleware/auditLog';
import { AuditAction } from '@prisma/client';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true,
      avatarUrl: true, role: true, isEmailVerified: true, isTwoFactorEnabled: true,
      isActive: true, lastLoginAt: true, lastLoginIp: true, createdAt: true, updatedAt: true,
    },
  });
  sendSuccess(res, user, 'Profile retrieved');
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { firstName, lastName, phone } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(phone !== undefined && { phone }),
    },
    select: {
      id: true, email: true, firstName: true, lastName: true, phone: true,
      avatarUrl: true, role: true, updatedAt: true,
    },
  });

  await createAuditLog({ userId: req.user.userId, action: AuditAction.PROFILE_UPDATE, ipAddress: req.ip });
  sendSuccess(res, updated, 'Profile updated');
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) throw new AppError('User not found', 404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError('Current password is incorrect', 400);

  if (currentPassword === newPassword) throw new AppError('New password must differ from current password', 400);

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { password: hashed, refreshToken: null },
  });

  await createAuditLog({ userId: req.user.userId, action: AuditAction.PASSWORD_CHANGE, ipAddress: req.ip });
  sendSuccess(res, null, 'Password changed successfully. Please log in again.');
};

export const uploadAvatar = async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response): Promise<void> => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { avatarUrl: true } });

  // Delete old avatar
  if (user?.avatarUrl) {
    const oldPath = path.join(process.cwd(), user.avatarUrl.replace(/^\//, ''));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const updated = await prisma.user.update({
    where: { id: req.user.userId },
    data: { avatarUrl },
    select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
  });

  sendSuccess(res, updated, 'Avatar uploaded');
};

export const deleteAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { avatarUrl: true } });
  if (user?.avatarUrl) {
    const filePath = path.join(process.cwd(), user.avatarUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  await prisma.user.update({ where: { id: req.user.userId }, data: { avatarUrl: null } });
  sendSuccess(res, null, 'Avatar removed');
};
