import express from 'express';
import { getConversations, getMessages, sendMessage, getRecipientDetails, getUnreadCount } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.get('/messages/:userId', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);
router.get('/recipient/:userId', authenticateToken, getRecipientDetails);

export default router;
