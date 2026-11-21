import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import {
    getPlatformStats,
    flushExpiredSessions,
    broadcastSystemAnnouncement
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getPlatformStats);
router.get('/stats', adminAuthMiddleware, getPlatformStats);
router.post('/flush-sessions', adminAuthMiddleware, flushExpiredSessions);
router.post('/broadcast', adminAuthMiddleware, broadcastSystemAnnouncement);

export default router;
