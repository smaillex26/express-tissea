import express from 'express';
import { signup, login } from '../controllers/user.controller.js';

const router = express.Router();

// Routes d'authentification
router.post('/users/signup', signup);
router.post('/users/login', login);

export default router;