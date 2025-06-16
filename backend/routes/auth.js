import express from 'express';
import { register, login, getProfile, verifyToken, adminLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/register', uploadSingle('profilePicture'), validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/verify-token', authenticateToken, verifyToken); 

export default router;
