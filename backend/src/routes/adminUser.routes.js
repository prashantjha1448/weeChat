import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
    searchUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    changeUserRoleAdmin,
    toggleBanUserAdmin,
    deleteUserAdmin,
    getUserDeepDiveAdmin,
    revokeUserSessionAdmin
} from '../controller/adminUser.controller.js';

const router = express.Router();

// Allow both admin and moderator to search/view, but reserve write/ban/delete for admin or moderator
router.get('/users', authMiddleware, requireRole(['admin', 'moderator']), searchUsersAdmin);
router.post('/users', authMiddleware, requireRole(['admin']), createUserAdmin);
router.put('/users/:userId', authMiddleware, requireRole(['admin', 'moderator']), updateUserAdmin);
router.patch('/users/:userId/role', authMiddleware, requireRole(['admin']), changeUserRoleAdmin);
router.patch('/users/:userId/ban', authMiddleware, requireRole(['admin', 'moderator']), toggleBanUserAdmin);
router.delete('/users/:userId', authMiddleware, requireRole(['admin']), deleteUserAdmin);

// User Deep-Dive Inspector (Device/login history, locations, feature usage)
router.get('/users/:userId/deep-dive', authMiddleware, requireRole(['admin', 'moderator']), getUserDeepDiveAdmin);
router.delete('/users/:userId/sessions/:sessionId', authMiddleware, requireRole(['admin']), revokeUserSessionAdmin);

export default router;
