import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { startCall, endCall, getCallHistory } from '../controller/callSession.controller.js';

const router = express.Router();

router.post('/start', authMiddleware, startCall);
router.post('/end', authMiddleware, endCall);
router.get('/history', authMiddleware, getCallHistory);

export default router;
