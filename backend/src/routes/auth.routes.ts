import { Router } from 'express';
import {
  register, login, logout, refreshTokens,
  verifyEmail, forgotPassword, resetPassword, resendVerification,
} from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshTokens);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/resend-verification', authLimiter, resendVerification);

export default router;
