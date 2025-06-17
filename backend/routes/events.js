import express from 'express';
import {
  getAllEvents,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
  createEvent,
  getEventRegistrations,
  updateAttendance // Import the new function
} from '../controllers/eventController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
  validateId,
  validateEventId,
  validateEventRegistration,
  validatePagination
} from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js'; // Import the upload middleware

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validatePagination, getAllEvents);
router.get('/:id', optionalAuth, validateId, getEventById);

// Protected routes
// ADD THIS NEW ROUTE for creating an event
router.post('/', authenticateToken, uploadSingle('image'), createEvent);

router.get('/user/registered', authenticateToken, getUserEvents);
router.post('/:eventId/register', authenticateToken, validateEventId, validateEventRegistration, registerForEvent);
router.delete('/:eventId/unregister', authenticateToken, validateEventId, unregisterFromEvent);
router.get('/:id/registrations', authenticateToken, getEventRegistrations);
router.post('/:id/attendance', authenticateToken, updateAttendance);
export default router;
