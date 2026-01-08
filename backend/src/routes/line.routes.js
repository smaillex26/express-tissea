import express from 'express';
import {
  getAllLines,
  getLineById,
  getLineStops,
  updateLine,
  addStopToLine,
  removeStopFromLine,
  calculateLineDistance
} from '../controllers/line.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. GET - /api/lines
router.get('/lines', authMiddleware, getAllLines);

// 2. GET - /api/lines/:id
router.get('/lines/:id', authMiddleware, getLineById);

// 3. GET - /api/lines/:id/stops
router.get('/lines/:id/stops', authMiddleware, getLineStops);

// 8. POST - /api/lines/:id/stops
router.post('/lines/:id/stops', authMiddleware, addStopToLine);

// 9. PUT - /api/lines/:id
router.put('/lines/:id', authMiddleware, updateLine);

// 10. DELETE - /api/lines/:lineId/stops/:stopId
router.delete('/lines/:lineId/stops/:stopId', authMiddleware, removeStopFromLine);

// 5. GET - /api/stats/distance/lines/:id
router.get('/stats/distance/lines/:id', authMiddleware, calculateLineDistance);

export default router;
