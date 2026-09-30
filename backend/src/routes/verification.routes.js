import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { resendOtp, verifyEmail } from '../controller/verification.controller.js';

const router = express.Router();

router.post('/resend-otp', authMiddleware, resendOtp);
router.post('/verify-email', authMiddleware, verifyEmail);

export default router;
