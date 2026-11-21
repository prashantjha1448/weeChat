import express from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware.js';
import {
    searchUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    toggleBanUserAdmin,
    deleteUserAdmin,
    getUserDeepDiveAdmin,
    revokeUserSessionAdmin
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, searchUsersAdmin);
router.post('/', adminAuthMiddleware, createUserAdmin);
router.put('/:userId', adminAuthMiddleware, updateUserAdmin);
router.patch('/:userId/ban', adminAuthMiddleware, toggleBanUserAdmin);
router.delete('/:userId', adminAuthMiddleware, deleteUserAdmin);
router.get('/:userId/deep-dive', adminAuthMiddleware, getUserDeepDiveAdmin);
router.delete('/:userId/sessions/:sessionId', adminAuthMiddleware, revokeUserSessionAdmin);

export default router;
