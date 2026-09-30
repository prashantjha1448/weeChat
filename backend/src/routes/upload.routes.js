import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadMediaMiddleware } from '../middleware/upload.middleware.js';
import { uploadMedia } from '../controller/upload.controller.js';

const router = express.Router();

router.post('/media', authMiddleware, uploadMediaMiddleware.single('file'), uploadMedia);

export default router;
