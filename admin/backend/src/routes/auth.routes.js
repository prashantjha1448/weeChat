import express from 'express';
import { adminLogin, getAdminProfile, getAdminAuditLogs } from '../controllers/auth.controller.js';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', adminAuthMiddleware, getAdminProfile);
router.get('/get-me', adminAuthMiddleware, getAdminProfile);
router.get('/logs', adminAuthMiddleware, getAdminAuditLogs);

export default router;
