import express from 'express';
import { getDistanceBetweenStops } from '../controllers/stats.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 4. GET - /api/stats/distance/stops/:id1/:id2
router.get('/stats/distance/stops/:id1/:id2', authMiddleware, getDistanceBetweenStops);

export default router;
