import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUserSessions, revokeSession, logoutAllSessions } from '../controller/session.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getUserSessions);
router.delete('/:sessionId', authMiddleware, revokeSession);
router.post('/logout-all', authMiddleware, logoutAllSessions);

export default router;
