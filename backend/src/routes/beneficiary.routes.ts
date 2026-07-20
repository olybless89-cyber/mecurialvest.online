import { Router } from 'express';
import { getBeneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } from '../controllers/beneficiary.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate as any);

router.get('/', getBeneficiaries as any);
router.post('/', addBeneficiary as any);
router.patch('/:id', updateBeneficiary as any);
router.delete('/:id', deleteBeneficiary as any);

export default router;
