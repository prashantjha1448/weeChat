import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import {
    getAdsConfigAdmin,
    updateAdsConfigAdmin,
    toggleAdPlacementAdmin,
    getActivePublicAds,
    trackAdEvent
} from '../controllers/ads.controller.js';

const router = express.Router();

// Public endpoints
router.get('/public', getActivePublicAds);
router.post('/public/:placementId/event', trackAdEvent);

// Admin-protected endpoints
router.get('/', adminAuthMiddleware, getAdsConfigAdmin);
router.put('/', adminAuthMiddleware, updateAdsConfigAdmin);
router.patch('/:placementId/toggle', adminAuthMiddleware, toggleAdPlacementAdmin);

export default router;
