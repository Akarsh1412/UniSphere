import express from 'express';
import { 
  updateProfile, 
  changePassword, 
  getUserStats, 
  getUserClubs, 
  getAllUsers, 
  getCurrentUser, 
  getAllStudentEmails,
  getEventParticipantEmails
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUpdateProfile, validateChangePassword } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllUsers);

// All routes are protected
router.get('/students/emails', getAllStudentEmails);
router.get('/participants/emails/:eventId', getEventParticipantEmails);

router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, uploadSingle('profilePicture'), validateUpdateProfile, updateProfile);
router.put('/password', authenticateToken, validateChangePassword, changePassword);
router.get('/stats', authenticateToken, getUserStats);
router.get('/clubs', authenticateToken, getUserClubs);

export default router;
