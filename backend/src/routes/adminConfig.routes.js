import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getAppConfigs, setAppConfig } from '../controller/adminConfig.controller.js';

const router = express.Router();

router.get('/config', authMiddleware, requireRole(['admin']), getAppConfigs);
router.post('/config', authMiddleware, requireRole(['admin']), setAppConfig);

export default router;
