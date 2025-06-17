import express from 'express';
import { 
  getAllClubs, 
  getClubById, 
  joinClub, 
  leaveClub, 
  getClubCategories,
  createClub
} from '../controllers/clubController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateId, validateClubId, validatePagination } from '../middleware/validation.js';
import { uploadFields } from '../middleware/upload.js';
const router = express.Router();

// Public routes
router.get('/', optionalAuth, validatePagination, getAllClubs);
router.get('/categories', getClubCategories);
router.get('/:id', optionalAuth, validateId, getClubById);

// Protected routes
router.post('/:clubId/join', authenticateToken, validateClubId, joinClub);
router.delete('/:clubId/leave', authenticateToken, validateClubId, leaveClub);


router.post(
  '/',
  authenticateToken,
  uploadFields([{ name: 'image', maxCount: 1 }, { name: 'cover_image', maxCount: 1 }]),
  createClub
);
export default router;
