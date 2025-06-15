import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  registerForEvent, 
  unregisterFromEvent, 
  getUserEvents 
} from '../controllers/eventController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { 
  validateId, 
  validateEventId, 
  validateEventRegistration, 
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validatePagination, getAllEvents);
router.get('/:id', optionalAuth, validateId, getEventById);

// Protected routes - PUT SPECIFIC ROUTES FIRST
router.get('/user/registered', authenticateToken, getUserEvents);

// Parameterized routes - PUT THESE LAST
router.post('/:eventId/register', authenticateToken, validateEventId, validateEventRegistration, registerForEvent);
router.delete('/:eventId/unregister', authenticateToken, validateEventId, unregisterFromEvent);

export default router;
