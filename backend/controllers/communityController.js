import pool from '../config/database.js';

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?.userId;
    
    const offset = (page - 1) * limit;
    
    const result = await pool.query(`
      SELECT p.*, u.name as author_name, u.profile_picture as author_avatar,
             COUNT(DISTINCT l.id) as likes_count,
             COUNT(DISTINCT c.id) as comments_count,
             ${userId ? `CASE WHEN ul.id IS NOT NULL THEN true ELSE false END as is_liked` : 'false as is_liked'}
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      ${userId ? 'LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = $3' : ''}
      GROUP BY p.id, u.name, u.profile_picture${userId ? ', ul.id' : ''}
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `, userId ? [limit, offset, userId] : [limit, offset]);
    
    // Get comments for each post
    for (let post of result.rows) {
      const commentsResult = await pool.query(`
        SELECT c.*, u.name as author_name, u.profile_picture as author_avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
        LIMIT 5
      `, [post.id]);
      
      post.comments = commentsResult.rows;
    }
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM posts');
    const totalPosts = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      posts: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page * limit < totalPosts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    
    const result = await pool.query(`
      INSERT INTO posts (user_id, content, image)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [userId, content.trim(), image]);
    
    // Get the created post with user details
    const postResult = await pool.query(`
      SELECT p.*, u.name as author_name, u.profile_picture as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: {
        ...postResult.rows[0],
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        comments: []
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if already liked
    const existingLike = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    
    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      
      await pool.query(
        'UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
        [postId]
      );
      
      res.json({ 
        success: true, 
        message: 'Post unliked',
        liked: false
      });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      
      await pool.query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
        [postId]
      );
      
      res.json({ 
        success: true, 
        message: 'Post liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const result = await pool.query(`
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [postId, userId, content.trim()]);
    
    // Get comment with user details
    const commentResult = await pool.query(`
      SELECT c.*, u.name as author_name, u.profile_picture as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: commentResult.rows[0]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    
    // Check if post exists and user owns it
    const postResult = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (postResult.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete post (comments and likes will be deleted due to CASCADE)
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment share count
    await pool.query(
      'UPDATE posts SET shares_count = shares_count + 1 WHERE id = $1',
      [postId]
    );
    
    res.json({
      success: true,
      message: 'Post shared successfully'
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
