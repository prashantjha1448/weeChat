import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import {
    getSupportQueries,
    resolveSupportQuery,
    updateQueryStatus,
    getAbuseReports
} from '../controllers/query.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getSupportQueries);
router.patch('/:ticketId/resolve', adminAuthMiddleware, resolveSupportQuery);
router.patch('/:ticketId/status', adminAuthMiddleware, updateQueryStatus);
router.get('/reports', adminAuthMiddleware, getAbuseReports);

export default router;
