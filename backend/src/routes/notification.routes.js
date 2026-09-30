import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUserNotifications, markNotificationRead } from '../controller/notification.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getUserNotifications);
router.patch('/:id/read', authMiddleware, markNotificationRead);

export default router;
