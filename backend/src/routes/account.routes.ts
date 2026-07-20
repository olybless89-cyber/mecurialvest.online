import { Router } from 'express';
import {
  getAccounts, getAccountById, createAccount, updateAccount,
  freezeAccount, unfreezeAccount, getAccountStats, getAccountTransactions,
} from '../controllers/account.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate as any);

router.get('/', getAccounts as any);
router.get('/stats', getAccountStats as any);
router.post('/', createAccount as any);
router.get('/:id', getAccountById as any);
router.patch('/:id', updateAccount as any);
router.post('/:id/freeze', freezeAccount as any);
router.post('/:id/unfreeze', unfreezeAccount as any);
router.get('/:id/transactions', getAccountTransactions as any);

export default router;
