import { Router } from 'express';
import {
  getTransactions, getTransactionById,
  getTransactionSummary, getSpendingTrend, exportTransactions,
} from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.get('/', getTransactions as any);
router.get('/summary', getTransactionSummary as any);
router.get('/trend', getSpendingTrend as any);
router.get('/export', exportTransactions as any);
router.get('/:id', getTransactionById as any);

export default router;
