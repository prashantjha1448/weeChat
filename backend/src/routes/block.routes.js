import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { blockUser, unblockUser, getMyBlockedUsers } from '../controller/block.controller.js';

const router = express.Router();

router.post('/', authMiddleware, blockUser);
router.delete('/:blockedUserId', authMiddleware, unblockUser);
router.get('/my-blocked', authMiddleware, getMyBlockedUsers);

export default router;
