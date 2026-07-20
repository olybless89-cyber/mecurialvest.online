import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, NotFoundError } from '../types';
import { sendSuccess, parsePagination, getPaginationMeta } from '../utils/apiResponse';

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
  const { unreadOnly } = req.query as { unreadOnly?: string };

  const where = {
    userId: req.user.userId,
    ...(unreadOnly === 'true' && { isRead: false }),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: req.user.userId, isRead: false } }),
  ]);

  sendSuccess(res, { notifications, unreadCount }, 'Notifications retrieved', 200, getPaginationMeta(total, page, limit));
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const notification = await prisma.notification.findFirst({ where: { id, userId: req.user.userId } });
  if (!notification) throw new NotFoundError('Notification');

  const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
  sendSuccess(res, updated, 'Notification marked as read');
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { count } = await prisma.notification.updateMany({
    where: { userId: req.user.userId, isRead: false },
    data: { isRead: true },
  });
  sendSuccess(res, { updated: count }, `${count} notifications marked as read`);
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const notification = await prisma.notification.findFirst({ where: { id, userId: req.user.userId } });
  if (!notification) throw new NotFoundError('Notification');

  await prisma.notification.delete({ where: { id } });
  sendSuccess(res, null, 'Notification deleted');
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const count = await prisma.notification.count({ where: { userId: req.user.userId, isRead: false } });
  sendSuccess(res, { count }, 'Unread count retrieved');
};
