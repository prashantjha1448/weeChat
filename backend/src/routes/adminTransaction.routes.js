import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
    getAdminTransactions,
    createAdminTransaction,
    updateAdminTransactionStatus
} from '../controller/adminTransaction.controller.js';

const router = express.Router();

router.get('/transactions', authMiddleware, requireRole(['admin', 'moderator']), getAdminTransactions);
router.post('/transactions', authMiddleware, requireRole(['admin']), createAdminTransaction);
router.patch('/transactions/:txId/status', authMiddleware, requireRole(['admin']), updateAdminTransactionStatus);

export default router;
