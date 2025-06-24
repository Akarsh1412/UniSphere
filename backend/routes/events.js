import express from 'express';
import {
  getAllEvents,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
  createEvent,
  getEventRegistrations,
  updateAttendance,
  createEventPaymentIntent,
  confirmEventPaymentAndRegister,
  getEventRevenue

} from '../controllers/eventController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
  validateId,
  validateEventId,
  validateEventRegistration,
  validatePagination
} from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validatePagination, getAllEvents);
router.get('/:id', optionalAuth, validateId, getEventById);

// Payment routes
router.post('/:eventId/create-payment-intent', authenticateToken, createEventPaymentIntent);
router.post('/confirm-payment', authenticateToken, confirmEventPaymentAndRegister);

// Protected routes
router.post('/', authenticateToken, uploadSingle('image'), createEvent);
router.get('/user/registered', authenticateToken, getUserEvents);
router.post('/:eventId/register', authenticateToken, validateEventId, validateEventRegistration, registerForEvent);
router.delete('/:eventId/unregister', authenticateToken, validateEventId, unregisterFromEvent);
router.get('/:id/registrations', authenticateToken, getEventRegistrations);
router.post('/:id/attendance', authenticateToken, updateAttendance);

router.get('/events/:id/revenue', authenticateToken, getEventRevenue);

export default router;
