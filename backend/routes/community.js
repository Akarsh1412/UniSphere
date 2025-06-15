import express from 'express';
import { 
  getAllPosts, 
  createPost, 
  likePost, 
  addComment, 
  deletePost, 
  sharePost 
} from '../controllers/communityController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { 
  validateCreatePost, 
  validateComment, 
  validatePostId, 
  validatePagination 
} from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/posts', optionalAuth, validatePagination, getAllPosts);

// Protected routes
router.post('/posts', authenticateToken, uploadSingle('image'), validateCreatePost, createPost);
router.post('/posts/:postId/like', authenticateToken, validatePostId, likePost);
router.post('/posts/:postId/comments', authenticateToken, validatePostId, validateComment, addComment);
router.delete('/posts/:postId', authenticateToken, validatePostId, deletePost);
router.post('/posts/:postId/share', authenticateToken, validatePostId, sharePost);

export default router;
