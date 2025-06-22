import { Post, Comment, Like, pool } from "../models/index.js";
import Ably from "ably";

const ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });

const communityChannel = ably.channels.get("community-posts");

export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?.userId || null;
    
    const offset = (page - 1) * limit;

    // Convert userId to integer to ensure proper matching
    const userIdInt = userId ? parseInt(userId) : null;

    let query, params;

    if (userIdInt) {
      query = `
        SELECT p.*, 
               u.id as user_id, 
               u.name as author_name, 
               u.profile_picture as author_avatar,
               p.likes_count, 
               p.shares_count,
               (SELECT COUNT(*)::integer FROM comments WHERE post_id = p.id) as comments_count,
               CASE 
                 WHEN EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $3) THEN true 
                 ELSE false 
               END as is_liked
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      params = [limit, offset, userIdInt];
    } else {
      query = `
        SELECT p.*, 
               u.id as user_id, 
               u.name as author_name, 
               u.profile_picture as author_avatar,
               p.likes_count, 
               p.shares_count,
               (SELECT COUNT(*)::integer FROM comments WHERE post_id = p.id) as comments_count,
               false as is_liked
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      params = [limit, offset];
    }

    const result = await pool.query(query, params);

    // Map the results to match frontend expectations with explicit boolean conversion
    const mappedPosts = result.rows.map((post) => ({
      ...post,
      user_name: post.author_name,
      user_profile_picture: post.author_avatar,
      user_id: post.user_id,
      // Force boolean conversion - handle PostgreSQL's 't'/'f' strings
      is_liked: post.is_liked === true || post.is_liked === 't' || post.is_liked === 'true'
    }));

    for (let post of mappedPosts) {
      const commentsResult = await pool.query(
        `
        SELECT c.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
        LIMIT 5;
      `,
        [post.id]
      );

      // Map comment fields to match frontend expectations
      post.comments = commentsResult.rows.map((comment) => ({
        ...comment,
        user_name: comment.author_name,
        user_profile_picture: comment.author_avatar,
      }));
    }

    const totalPosts = await Post.count();

    res.json({
      success: true,
      posts: mappedPosts,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
      },
    });
  } catch (error) {
    console.error('getAllPosts error:', error);
    next(error);
  }
};



export const createPost = async (req, res, next) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.userId;

    const newPostData = await Post.create({ user_id: userId, content, image });

    const hydratedPostQuery = await pool.query(
      `
        SELECT p.*, 
               u.id as user_id, 
               u.name as author_name, 
               u.profile_picture as author_avatar,
               0 as likes_count, 
               0 as shares_count, 
               0 as comments_count, 
               false as is_liked
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
    `,
      [newPostData.id]
    );

    const hydratedPost = hydratedPostQuery.rows[0];

    // Map fields to match frontend expectations
    const mappedPost = {
      ...hydratedPost,
      user_name: hydratedPost.author_name,
      user_profile_picture: hydratedPost.author_avatar,
      comments: [],
    };

    await communityChannel.publish("newPost", mappedPost);

    res
      .status(201)
      .json({
        success: true,
        message: "Post created successfully",
        post: mappedPost,
      });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    
    // Convert to integers for proper database matching
    const postIdInt = parseInt(postId);
    const userIdInt = parseInt(userId);
    
    if (isNaN(postIdInt) || isNaN(userIdInt)) {
      return res.status(400).json({ message: 'Invalid post or user ID' });
    }
    
    // Check if like exists using raw SQL for consistency
    const existingLikeResult = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userIdInt, postIdInt]
    );
    
    let newLikesCount;
    const isCurrentlyLiked = existingLikeResult.rows.length > 0;

    if (isCurrentlyLiked) {
      // Unlike the post
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userIdInt, postIdInt]);
      const result = await pool.query('UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1 RETURNING likes_count', [postIdInt]);
      newLikesCount = result.rows[0].likes_count;
    } else {
      // Like the post
      await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userIdInt, postIdInt]);
      const result = await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count', [postIdInt]);
      newLikesCount = result.rows[0].likes_count;
    }

    // Get all users who have liked this post for user-specific updates
    const likersResult = await pool.query(
      'SELECT user_id FROM likes WHERE post_id = $1',
      [postIdInt]
    );
    const likerIds = likersResult.rows.map(row => parseInt(row.user_id));

    // Send user-specific like data
    await communityChannel.publish('updateLike', {
      postId: postIdInt,
      likesCount: parseInt(newLikesCount),
      userId: userIdInt,
      isLiking: !isCurrentlyLiked,
      likerIds: likerIds
    });
    
    res.json({ success: true, message: 'Like status toggled' });
  } catch (error) {
    console.error('likePost error:', error);
    next(error);
  }
};


export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Convert postId to integer
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const newCommentData = await Comment.create({
      post_id: postIdInt,
      user_id: userId,
      content,
    });

    const hydratedCommentQuery = await pool.query(
      `
        SELECT c.*, u.id as user_id, u.name as author_name, u.profile_picture as author_avatar
        FROM comments c JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
    `,
      [newCommentData.id]
    );

    const hydratedComment = hydratedCommentQuery.rows[0];

    // Map fields to match frontend expectations
    const mappedComment = {
      ...hydratedComment,
      user_name: hydratedComment.author_name,
      user_profile_picture: hydratedComment.author_avatar,
    };

    // Make sure postId is sent as integer
    await communityChannel.publish("newComment", {
      postId: postIdInt, // Send as integer to match frontend expectations
      comment: mappedComment,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Comment added",
        comment: mappedComment,
      });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user_id !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await Post.delete(postId);
    await communityChannel.publish("deletePost", { postId });
    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId, postId } = req.params;
    const userId = req.user.userId;

    // Convert IDs to integers
    const commentIdInt = parseInt(commentId);
    const postIdInt = parseInt(postId);

    if (isNaN(commentIdInt) || isNaN(postIdInt)) {
      return res.status(400).json({ message: "Invalid comment or post ID" });
    }

    const comment = await Comment.findById(commentIdInt);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user_id !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await Comment.delete(commentIdInt);

    // Send integers to match frontend expectations
    await communityChannel.publish("deleteComment", {
      postId: postIdInt,
      commentId: commentIdInt,
    });

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

export const sharePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      "UPDATE posts SET shares_count = shares_count + 1 WHERE id = $1 RETURNING shares_count",
      [postId]
    );

    await communityChannel.publish("sharePost", {
      postId,
      sharesCount: result.rows[0].shares_count,
    });

    res.json({ success: true, message: "Share count updated" });
  } catch (error) {
    next(error);
  }
};
