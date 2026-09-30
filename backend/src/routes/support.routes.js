import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createSupportTicket, getMySupportTickets } from '../controller/support.controller.js';

const router = express.Router();

router.post('/ticket', authMiddleware, createSupportTicket);
router.get('/my-tickets', authMiddleware, getMySupportTickets);

export default router;
