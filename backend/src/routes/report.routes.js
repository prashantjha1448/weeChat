import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { createReport, getMyReports, getAllReportsAdmin } from '../controller/report.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createReport);
router.get('/my-reports', authMiddleware, getMyReports);
router.get('/admin-all', authMiddleware, requireRole(['admin', 'moderator']), getAllReportsAdmin);

export default router;
