import { Post, Comment, Like, pool } from '../models/index.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?.userId;
    const offset = (page - 1) * limit;

    const query = `
      SELECT p.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar,
      p.likes_count, p.shares_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
      ${userId ? `(SELECT EXISTS (SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $3)) as is_liked` : 'false as is_liked'}
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    
    const result = await pool.query(query, userId ? [limit, offset, userId] : [limit, offset]);
    
    for (let post of result.rows) {
      const commentsResult = await pool.query(`
        SELECT c.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
        LIMIT 5;
      `, [post.id]);
      post.comments = commentsResult.rows;
    }
    
    const totalPosts = await Post.count();
    
    res.json({
      success: true,
      posts: result.rows,
      pagination: { currentPage: parseInt(page, 10), totalPages: Math.ceil(totalPosts / limit), totalPosts }
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.userId;

    const newPostData = await Post.create({ user_id: userId, content, image });
    
    const hydratedPostQuery = await pool.query(`
        SELECT p.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
    `, [newPostData.id]);
    
    const hydratedPost = hydratedPostQuery.rows[0];
    hydratedPost.comments = [];

    req.io.emit('newPost', hydratedPost);

    res.status(201).json({ success: true, message: 'Post created successfully', post: hydratedPost });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const existingLike = await Like.findAll({ user_id: userId, post_id: postId });
    let newLikesCount;

    if (existingLike.length > 0) {
      await pool.query('DELETE FROM likes WHERE id = $1', [existingLike[0].id]);
      const result = await pool.query('UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1 RETURNING likes_count', [postId]);
      newLikesCount = result.rows[0].likes_count;
    } else {
      await Like.create({ user_id: userId, post_id: postId });
      const result = await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count', [postId]);
      newLikesCount = result.rows[0].likes_count;
    }

    req.io.emit('updateLike', { postId, likesCount: newLikesCount, liked: existingLike.length === 0, userId });
    
    res.json({ success: true, message: 'Like status toggled' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const newCommentData = await Comment.create({ post_id: postId, user_id: userId, content });
    
    const hydratedCommentQuery = await pool.query(`
        SELECT c.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar
        FROM comments c JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
    `, [newCommentData.id]);

    const hydratedComment = hydratedCommentQuery.rows[0];

    req.io.emit('newComment', { postId, comment: hydratedComment });

    res.status(201).json({ success: true, message: 'Comment added', comment: hydratedComment });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== userId) return res.status(403).json({ message: 'Not authorized' });

    await Post.delete(postId);
    req.io.emit('deletePost', { postId });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user_id !== userId) return res.status(403).json({ message: 'Not authorized' });

    await Comment.delete(commentId);
    req.io.emit('deleteComment', { postId: comment.post_id, commentId });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

export const sharePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const result = await pool.query('UPDATE posts SET shares_count = shares_count + 1 WHERE id = $1 RETURNING shares_count', [postId]);
        req.io.emit('sharePost', { postId, sharesCount: result.rows[0].shares_count });
        res.json({ success: true, message: 'Share count updated' });
    } catch (error) {
        next(error);
    }
};
