import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import {
    getAdminTransactions,
    createAdminTransaction,
    updateAdminTransactionStatus
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getAdminTransactions);
router.post('/', adminAuthMiddleware, createAdminTransaction);
router.patch('/:txId/status', adminAuthMiddleware, updateAdminTransactionStatus);

export default router;
