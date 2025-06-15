import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/register', uploadSingle('profilePicture'), validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
