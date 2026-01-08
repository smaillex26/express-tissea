import express from 'express';
import { getLinesByCategory } from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. GET - /api/categories/:id/lines
router.get('/categories/:id/lines', authMiddleware, getLinesByCategory);

export default router;
