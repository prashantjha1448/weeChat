import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validations/profile.validation.js';
import { updatePreferenceSchema } from '../validations/preference.validation.js';
import {
    getProfile,
    updateProfile,
    getPreference,
    updatePreference,
    getInterests
} from '../controller/profile.controller.js';

const router = express.Router();

// Public Tags Listing Endpoint (Step 1 Master Data)
router.get('/interests', getInterests);

// Protected Profile Endpoints (Step 4 & 5)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

// Protected Match Preference Endpoints (Step 4 & 5)
router.get('/preferences', authMiddleware, getPreference);
router.put('/preferences', authMiddleware, validate(updatePreferenceSchema), updatePreference);

export default router;
