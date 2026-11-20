import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { startCall, endCall, getCallHistory } from '../controller/callSession.controller.js';
import { getIceServersConfig } from '../config/webrtc.config.js';

const router = express.Router();

router.post('/start', authMiddleware, startCall);
router.post('/end', authMiddleware, endCall);
router.get('/history', authMiddleware, getCallHistory);
router.get('/ice-servers', authMiddleware, (req, res) => {
    const config = getIceServersConfig(req.user?._id || 'guest');
    res.json(config);
});

export default router;
