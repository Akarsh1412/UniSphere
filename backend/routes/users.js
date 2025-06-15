import express from 'express';
import { 
  updateProfile, 
  changePassword, 
  getUserStats, 
  getUserClubs 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.put('/profile', authenticateToken, uploadSingle('profilePicture'), validateUpdateProfile, updateProfile);
router.put('/password', authenticateToken, validateChangePassword, changePassword);
router.get('/stats', authenticateToken, getUserStats);
router.get('/clubs', authenticateToken, getUserClubs);

export default router;
