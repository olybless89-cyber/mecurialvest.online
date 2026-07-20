import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, REFRESH_COOKIE_OPTIONS } from '../config/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/email';
import { generateSecureToken } from '../utils/generateToken';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createAuditLog } from '../middleware/auditLog';
import { AppError, UnauthorizedError } from '../types';
import { AuditAction, AccountType } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, 12);
  const verifyToken = generateSecureToken();
  const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        id: uuidv4(),
        email: email.toLowerCase(),
        password: hashed,
        firstName,
        lastName,
        phone,
        emailVerifyToken: verifyToken,
        emailVerifyExpiry: verifyExpiry,
      },
    });
    const accountNumber = await generateAccountNumber();
    await tx.account.create({
      data: {
        userId: newUser.id,
        accountNumber,
        type: AccountType.CHECKING,
        isDefault: true,
        nickname: 'Main Checking',
      },
    });
    await tx.notification.create({
      data: {
        userId: newUser.id,
        type: 'SYSTEM',
        title: 'Welcome to NexBank!',
        message: `Hi ${firstName}, your account is ready. Start managing your finances with NexBank.`,
      },
    });
    return newUser;
  });

  await sendVerificationEmail(user.email, user.firstName, verifyToken);
  await createAuditLog({ userId: user.id, action: AuditAction.REGISTER, resource: 'User', resourceId: user.id, ipAddress: req.ip });

  sendSuccess(res, { email: user.email, firstName: user.firstName }, 'Registration successful. Please verify your email.', 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account suspended. Contact support.', 403);
  if (!user.isEmailVerified) throw new AppError('Please verify your email before logging in.', 403);

  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLoginAt: new Date(), lastLoginIp: req.ip },
  });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  await createAuditLog({ userId: user.id, action: AuditAction.LOGIN, ipAddress: req.ip, userAgent: req.headers['user-agent'] });

  sendSuccess(res, {
    accessToken,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatarUrl: user.avatarUrl },
  }, 'Login successful');
};

export const logout = async (req: Request & { user?: { userId: string } }, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await prisma.user.update({ where: { id: payload.userId }, data: { refreshToken: null } });
      await createAuditLog({ userId: payload.userId, action: AuditAction.LOGOUT, ipAddress: req.ip });
    } catch { /* ignore */ }
  }
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  sendSuccess(res, null, 'Logged out successfully');
};

export const refreshTokens = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new UnauthorizedError('No refresh token');

  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.refreshToken !== token || !user.isActive) {
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    throw new UnauthorizedError('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ userId: user.id });
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } });
  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

  sendSuccess(res, {
    accessToken: newAccessToken,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatarUrl: user.avatarUrl },
  }, 'Token refreshed');
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query as { token: string };
  if (!token) throw new AppError('Verification token required', 400);

  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token, emailVerifyExpiry: { gt: new Date() } },
  });
  if (!user) throw new AppError('Invalid or expired verification token', 400);

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
  });
  await createAuditLog({ userId: user.id, action: AuditAction.EMAIL_VERIFY, ipAddress: req.ip });

  sendSuccess(res, null, 'Email verified successfully');
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Always respond 200 to prevent enumeration
  if (!user) {
    sendSuccess(res, null, 'If that email exists, a reset link has been sent.');
    return;
  }

  const resetToken = generateSecureToken();
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry } });
  await sendPasswordResetEmail(user.email, user.firstName, resetToken);

  sendSuccess(res, null, 'If that email exists, a reset link has been sent.');
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
  });
  if (!user) throw new AppError('Invalid or expired reset token', 400);

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, passwordResetToken: null, passwordResetExpiry: null, refreshToken: null },
  });
  await createAuditLog({ userId: user.id, action: AuditAction.PASSWORD_RESET, ipAddress: req.ip });

  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  sendSuccess(res, null, 'Password reset successful. Please log in.');
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.isEmailVerified) {
    sendSuccess(res, null, 'If that email exists and is unverified, a new link has been sent.');
    return;
  }
  const token = generateSecureToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken: token, emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });
  await sendVerificationEmail(user.email, user.firstName, token);
  sendSuccess(res, null, 'Verification email sent.');
};
