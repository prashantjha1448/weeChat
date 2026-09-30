import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { applyModerationAction, submitAppeal, getAuditLogs } from '../controller/moderation.controller.js';

const router = express.Router();

router.post('/action', authMiddleware, requireRole(['admin', 'moderator']), applyModerationAction);
router.post('/appeal', authMiddleware, submitAppeal);
router.get('/audits', authMiddleware, requireRole(['admin']), getAuditLogs);

export default router;
