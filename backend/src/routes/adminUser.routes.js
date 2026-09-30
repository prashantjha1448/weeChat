import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { searchUsersAdmin, changeUserRoleAdmin } from '../controller/adminUser.controller.js';

const router = express.Router();

router.get('/users', authMiddleware, requireRole(['admin']), searchUsersAdmin);
router.patch('/users/:userId/role', authMiddleware, requireRole(['admin']), changeUserRoleAdmin);

export default router;
