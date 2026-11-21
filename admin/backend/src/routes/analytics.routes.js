import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import { getPlatformStats } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getPlatformStats);
router.get('/stats', adminAuthMiddleware, getPlatformStats);

export default router;
