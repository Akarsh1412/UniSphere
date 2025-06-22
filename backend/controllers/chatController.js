import { DirectMessage, User, pool } from '../models/index.js';
import Ably from 'ably';

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

export const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            'SELECT COUNT(*) FROM direct_messages WHERE receiver_id = $1 AND is_read = false',
            [userId]
        );
        const count = parseInt(result.rows[0].count, 10);
        res.json({ success: true, count });
    } catch (error) {
        next(error);
    }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT DISTINCT ON (u.id)
          u.id, u.name, u.profile_picture, dm.content as last_message, dm.created_at
      FROM direct_messages dm
      JOIN users u ON u.id = dm.sender_id OR u.id = dm.receiver_id
      WHERE (dm.sender_id = $1 OR dm.receiver_id = $1) AND u.id != $1
      ORDER BY u.id, dm.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    res.json({ success: true, conversations: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.userId;
    
    const result = await pool.query(
      `SELECT * FROM direct_messages
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, otherUserId]
    );

    await pool.query(
      `UPDATE direct_messages SET is_read = true WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [currentUserId, otherUserId]
    );

    res.json({ success: true, messages: result.rows });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.userId;

        if (!receiverId || !content) {
            return res.status(400).json({ 
                success: false, 
                message: "Receiver and content are required." 
            });
        }

        const newMessage = await DirectMessage.create({
            sender_id: senderId,
            receiver_id: receiverId,
            content
        });
        
        // Publish to Ably instead of Socket.IO
        const channel = ably.channels.get(`private-messages-${receiverId}`);
        await channel.publish('new-message', newMessage);
        
        // Send notification
        const notificationChannel = ably.channels.get(`notifications-${receiverId}`);
        await notificationChannel.publish('unread-message', {
            senderId,
            content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
        });
        
        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        next(error);
    }
};

export const getRecipientDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: { id: user.id, name: user.name, profile_picture: user.profile_picture } });
    } catch (error) {
        next(error);
    }
};
