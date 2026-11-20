import express from 'express';
import { getPublicStats } from '../controller/publicStats.controller.js';

const router = express.Router();

// GET /api/public/stats
router.get('/', getPublicStats);

export default router;
