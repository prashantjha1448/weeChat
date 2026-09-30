import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
    createRoom,
    getActiveRooms,
    getRoomDetails,
    joinRoom,
    endRoom
} from '../controller/customRoom.controller.js';

const router = express.Router();

router.post('/create', authMiddleware, createRoom);
router.get('/active', authMiddleware, getActiveRooms);
router.get('/:roomId', authMiddleware, getRoomDetails);
router.post('/:roomId/join', authMiddleware, joinRoom);
router.delete('/:roomId', authMiddleware, endRoom);

export default router;
