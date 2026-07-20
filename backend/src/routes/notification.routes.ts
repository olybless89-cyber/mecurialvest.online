import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate as any);

router.get('/', getNotifications as any);
router.get('/unread-count', getUnreadCount as any);
router.patch('/read-all', markAllAsRead as any);
router.patch('/:id/read', markAsRead as any);
router.delete('/:id', deleteNotification as any);

export default router;
