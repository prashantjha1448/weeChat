import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getPlatformStats } from '../controller/adminAnalytics.controller.js';

const router = express.Router();

router.get('/stats', authMiddleware, requireRole(['admin']), getPlatformStats);

export default router;
