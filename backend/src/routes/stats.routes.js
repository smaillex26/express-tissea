import express from 'express';
import { getDistanceBetweenStops, getGeneralStats } from '../controllers/stats.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET - /api/stats - Statistiques générales (sans authentification pour la page d'accueil)
router.get('/stats', getGeneralStats);

// 4. GET - /api/stats/distance/stops/:id1/:id2
router.get('/stats/distance/stops/:id1/:id2', authMiddleware, getDistanceBetweenStops);

export default router;
