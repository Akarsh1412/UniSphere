import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.js';
import { Resend } from 'resend';

const { bcryptSaltRounds } = authConfig;

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profilePicture, registrationNumber } = req.body;
    
    // Build dynamic update query
    const updateFields = [];
    const params = [];
    let paramCount = 1;
    
    if (name) {
      updateFields.push(`name = $${paramCount}`);
      params.push(name);
      paramCount++;
    }
    
    if (profilePicture) {
      updateFields.push(`profile_picture = $${paramCount}`);
      params.push(profilePicture);
      paramCount++;
    }
    
    if (registrationNumber) {
      // Check if registration number is already taken
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE registration_number = $1 AND id != $2',
        [registrationNumber, userId]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Registration number already taken' });
      }
      
      updateFields.push(`registration_number = $${paramCount}`);
      params.push(registrationNumber);
      paramCount++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(userId);
    
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, profile_picture, registration_number, role, verified
    `;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get current password hash
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, bcryptSaltRounds);
    
    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's club memberships count
    const clubsResult = await pool.query(
      'SELECT COUNT(*) FROM club_memberships WHERE user_id = $1',
      [userId]
    );
    
    // Get user's event registrations count
    const eventsResult = await pool.query(
      'SELECT COUNT(*) FROM event_registrations WHERE user_id = $1',
      [userId]
    );
    
    // Get user's posts count
    const postsResult = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE user_id = $1',
      [userId]
    );
    
    // Get user's total likes received
    const likesResult = await pool.query(`
      SELECT COUNT(*) FROM likes l
      JOIN posts p ON l.post_id = p.id
      WHERE p.user_id = $1
    `, [userId]);
    
    res.json({
      success: true,
      stats: {
        clubsJoined: parseInt(clubsResult.rows[0].count),
        eventsRegistered: parseInt(eventsResult.rows[0].count),
        postsCreated: parseInt(postsResult.rows[0].count),
        likesReceived: parseInt(likesResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserClubs = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT c.*, cm.role, cm.joined_at,
             COUNT(DISTINCT cm2.user_id) as members_count
      FROM club_memberships cm
      JOIN clubs c ON cm.club_id = c.id
      LEFT JOIN club_memberships cm2 ON c.id = cm2.club_id
      WHERE cm.user_id = $1
      GROUP BY c.id, cm.role, cm.joined_at
      ORDER BY cm.joined_at DESC
    `, [userId]);
    
    res.json({
      success: true,
      clubs: result.rows
    });
  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT email FROM users`);
    res.status(201).json(
      result.rows
    );
  } catch (error) {
    console.error('Get All users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendEmail = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to, subject, html } = req.body;
    
    const { data, error } = await resend.emails.send({
      from: 'EventHub <onboarding@resend.dev>',
      to,
      subject,
      html
    });

    if (error) return res.status(500).json({ error });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};