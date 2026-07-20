import { Router } from 'express';
import authRoutes from './auth.routes';
import accountRoutes from './account.routes';
import transactionRoutes from './transaction.routes';
import transferRoutes from './transfer.routes';
import beneficiaryRoutes from './beneficiary.routes';
import notificationRoutes from './notification.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/accounts', accountRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/transfers', transferRoutes);
apiRouter.use('/beneficiaries', beneficiaryRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/admin', adminRoutes);
