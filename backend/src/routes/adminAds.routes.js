import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
    getAdsConfigAdmin,
    updateAdsConfigAdmin,
    toggleAdPlacementAdmin
} from '../controller/adminAds.controller.js';

const router = express.Router();

router.get('/ads', authMiddleware, requireRole(['admin', 'moderator']), getAdsConfigAdmin);
router.put('/ads', authMiddleware, requireRole(['admin']), updateAdsConfigAdmin);
router.patch('/ads/:placementId/toggle', authMiddleware, requireRole(['admin', 'moderator']), toggleAdPlacementAdmin);

export default router;
