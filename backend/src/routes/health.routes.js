import express from 'express';
import { getLivenessCheck, getReadinessCheck } from '../controller/health.controller.js';

const router = express.Router();

router.get('/health', getLivenessCheck);
router.get('/ready', getReadinessCheck);
router.get('/', getLivenessCheck);

export default router;
