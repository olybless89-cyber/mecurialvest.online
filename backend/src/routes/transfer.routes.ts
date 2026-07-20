import { Router } from 'express';
import { initiateTransfer, getTransfers } from '../controllers/transfer.controller';
import { authenticate } from '../middleware/auth';
import { transferLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate as any);

router.post('/', transferLimiter, initiateTransfer as any);
router.get('/', getTransfers as any);

export default router;
