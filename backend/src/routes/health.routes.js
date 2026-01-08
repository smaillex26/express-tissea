import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = Router();

// Route de santé
router.get('/health', healthCheck);

export default router;