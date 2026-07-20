import { Router } from 'express';
import { getProfile, updateProfile, changePassword, uploadAvatar, deleteAvatar } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { uploadAvatar as multerUpload } from '../config/multer';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(authenticate as any);

router.get('/', getProfile as any);
router.patch('/', updateProfile as any);
router.post('/change-password', changePassword as any);
router.post('/avatar', uploadLimiter, multerUpload.single('avatar'), uploadAvatar as any);
router.delete('/avatar', deleteAvatar as any);

export default router;
