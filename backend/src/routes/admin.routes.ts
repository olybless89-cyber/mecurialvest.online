import { Router } from 'express';
import {
  getDashboardStats, getUsers, getUserById, updateUser,
  getAllTransactions, reverseTransaction, getAuditLogs,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();
router.use(authenticate as any, requireAdmin as any);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser as any);
router.get('/transactions', getAllTransactions);
router.post('/transactions/:id/reverse', reverseTransaction as any);
router.get('/audit-logs', getAuditLogs);

export default router;
