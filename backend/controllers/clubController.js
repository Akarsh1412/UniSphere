import pool from '../config/database.js';
import stripe from 'stripe';
import authConfig from '../config/auth.js';

const stripeClient = stripe(authConfig.stripeSecret);

export const getAllClubs = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT c.*, u.name as admin_name, u.email as admin_email,
             COUNT(DISTINCT cm.user_id) as members_count,
             COUNT(DISTINCT e.id) as events_count
      FROM clubs c
      LEFT JOIN users u ON c.admin_id = u.id
      LEFT JOIN club_memberships cm ON c.id = cm.club_id
      LEFT JOIN events e ON c.id = e.club_id
    `;

    const params = [];
    const conditions = [];

    if (category && category !== 'All') {
      conditions.push(`c.category = $${params.length + 1}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(c.name ILIKE $${params.length + 1} OR c.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (featured === 'true') {
      conditions.push('c.featured = true');
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY c.id, u.name, u.email 
                ORDER BY c.featured DESC, c.rating DESC, c.created_at DESC`;

    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    let countQuery = 'SELECT COUNT(*) FROM clubs c';
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
      for (let i = 0; i < params.length - 2; i++) {
        countParams.push(params[i]);
      }
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalClubs = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      clubs: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalClubs / limit),
        totalClubs,
        hasNext: page * limit < totalClubs,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const clubResult = await pool.query(`
      SELECT c.*, u.name as admin_name, u.email as admin_email, u.profile_picture as admin_image,
             COUNT(DISTINCT cm.user_id) as members_count,
             COUNT(DISTINCT e.id) as events_count
      FROM clubs c
      LEFT JOIN users u ON c.admin_id = u.id
      LEFT JOIN club_memberships cm ON c.id = cm.club_id
      LEFT JOIN events e ON c.id = e.club_id
      WHERE c.id = $1
      GROUP BY c.id, u.name, u.email, u.profile_picture
    `, [id]);

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];

    let isMember = false;
    let memberRole = null;

    if (userId) {
      const membershipResult = await pool.query(
        'SELECT role FROM club_memberships WHERE user_id = $1 AND club_id = $2',
        [userId, id]
      );

      if (membershipResult.rows.length > 0) {
        isMember = true;
        memberRole = membershipResult.rows[0].role;
      }
    }

    const eventsResult = await pool.query(`
      SELECT id, title, description, date, time_start, venue, price, image, featured
      FROM events 
      WHERE club_id = $1 AND date >= CURRENT_DATE
      ORDER BY date ASC, time_start ASC
      LIMIT 5
    `, [id]);

    const membersResult = await pool.query(`
      SELECT u.id, u.name, u.profile_picture, cm.role, cm.joined_at
      FROM club_memberships cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.club_id = $1
      ORDER BY cm.joined_at DESC
      LIMIT 10
    `, [id]);

    res.json({
      success: true,
      club: {
        ...club,
        isMember,
        memberRole,
        upcomingEvents: eventsResult.rows,
        recentMembers: membersResult.rows
      }
    });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId;

    const clubResult = await pool.query(
      'SELECT id, name, membership_fee FROM clubs WHERE id = $1',
      [clubId]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];

    const existingMembership = await pool.query(
      'SELECT id FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    if (existingMembership.rows.length > 0) {
      return res.status(400).json({ message: 'Already a member of this club' });
    }

    if (club.membership_fee > 0) {
      return res.json({
        action: 'payment_required',
        clubId,
        fee: club.membership_fee
      });
    }

    await pool.query(
      'INSERT INTO club_memberships (user_id, club_id, role) VALUES ($1, $2, $3)',
      [userId, clubId, 'member']
    );

    res.json({
      success: true,
      message: `Successfully joined ${club.name}`
    });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const leaveClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId;

    const membershipResult = await pool.query(
      'SELECT role FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    if (membershipResult.rows.length === 0) {
      return res.status(400).json({ message: 'Not a member of this club' });
    }

    if (membershipResult.rows[0].role === 'admin') {
      return res.status(400).json({ message: 'Club admin cannot leave the club' });
    }

    await pool.query(
      'DELETE FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );

    res.json({
      success: true,
      message: 'Successfully left the club'
    });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClubCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM clubs WHERE category IS NOT NULL ORDER BY category'
    );

    const categories = ['All', ...result.rows.map(row => row.category)];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createClub = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      website,
      instagram,
      twitter,
      facebook
    } = req.body;

    let image = null;
    let cover_image = null;

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image = req.files.image[0].path || req.files.image[0].location || null;
      }
      if (req.files.cover_image && req.files.cover_image[0]) {
        cover_image = req.files.cover_image[0].path || req.files.cover_image[0].location || null;
      }
    }
    if (req.body.image && typeof req.body.image === 'string') image = req.body.image;
    if (req.body.cover_image && typeof req.body.cover_image === 'string') cover_image = req.body.cover_image;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Club name is required.' });
    }

    const result = await pool.query(
      `INSERT INTO clubs (name, description, category, image, cover_image, website, instagram, twitter, facebook)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, category, image, cover_image, website, instagram, twitter, facebook]
    );

    res.status(201).json({
      success: true,
      club: result.rows[0]
    });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating club' });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.userId;

    const clubResult = await pool.query(
      'SELECT id, name, membership_fee, stripe_price_id FROM clubs WHERE id = $1',
      [clubId]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];
    if (!club.membership_fee || club.membership_fee <= 0) {
      return res.status(400).json({ message: 'This club has no membership fee' });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(club.membership_fee * 100),
      currency: 'inr',
      metadata: {
        userId,
        clubId,
        clubName: club.name
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: club.membership_fee
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.userId;

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const { clubId } = paymentIntent.metadata;

    await pool.query(
      'INSERT INTO club_memberships (user_id, club_id, role) VALUES ($1, $2, $3)',
      [userId, clubId, 'member']
    );

    res.json({
      success: true,
      message: 'Payment confirmed and membership activated'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ success: false, message: 'Payment confirmation failed' });
  }
};