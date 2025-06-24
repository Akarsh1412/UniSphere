import pool from '../config/database.js';
import stripe from 'stripe';
import authConfig from '../config/auth.js';

const stripeClient = stripe(authConfig.stripeSecret);

export const getAllClubs = async (req, res) => {
  try {
    //console.log('getAllClubs: Starting execution.');
    const { category, search, featured, page = 1, limit = 10 } = req.query;
    //console.log('getAllClubs: Query parameters received -', { category, search, featured, page, limit });

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
      //console.log('getAllClubs: Added category condition:', category);
    }

    if (search) {
      conditions.push(`(c.name ILIKE $${params.length + 1} OR c.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
      //console.log('getAllClubs: Added search condition:', search);
    }

    if (featured === 'true') {
      conditions.push('c.featured = true');
      //console.log('getAllClubs: Added featured condition.');
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY c.id, u.name, u.email 
                 ORDER BY c.featured DESC, c.rating DESC, c.created_at DESC`;

    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    //console.log('getAllClubs: Constructed query:', query);
    //console.log('getAllClubs: Query parameters:', params);

    const result = await pool.query(query, params);
    //console.log('getAllClubs: Clubs query executed. Rows returned:', result.rows.length);

    let countQuery = 'SELECT COUNT(*) FROM clubs c';
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
      // The parameters for the count query should be the same as the main query,
      // excluding the limit and offset.
      for (let i = 0; i < params.length - 2; i++) {
        countParams.push(params[i]);
      }
    }
    //console.log('getAllClubs: Constructed count query:', countQuery);
    //console.log('getAllClubs: Count query parameters:', countParams);

    const countResult = await pool.query(countQuery, countParams);
    const totalClubs = parseInt(countResult.rows[0].count);
    //console.log('getAllClubs: Total clubs count:', totalClubs);

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
    //console.log('getAllClubs: Successfully sent response.');
  } catch (error) {
    console.error('getAllClubs: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClubById = async (req, res) => {
  try {
    //console.log('getClubById: Starting execution.');
    const { id } = req.params;
    const userId = req.user?.userId;
    //console.log('getClubById: Club ID received:', id);
    //console.log('getClubById: User ID from token (if any):', userId);


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
    //console.log('getClubById: Club query executed.');

    if (clubResult.rows.length === 0) {
      //console.log('getClubById: Club not found for ID:', id);
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];
    //console.log('getClubById: Club found:', club.name);

    let isMember = false;
    let memberRole = null;

    if (userId) {
      //console.log('getClubById: Checking membership for user:', userId);
      const membershipResult = await pool.query(
        'SELECT role FROM club_memberships WHERE user_id = $1 AND club_id = $2',
        [userId, id]
      );

      if (membershipResult.rows.length > 0) {
        isMember = true;
        memberRole = membershipResult.rows[0].role;
        //console.log('getClubById: User is a member with role:', memberRole);
      } else {
        //console.log('getClubById: User is not a member.');
      }
    } else {
      //console.log('getClubById: No user ID provided, skipping membership check.');
    }

    //console.log('getClubById: Fetching upcoming events.');
    const eventsResult = await pool.query(`
      SELECT id, title, description, date, time_start, venue, price, image, featured
      FROM events 
      WHERE club_id = $1 AND date >= CURRENT_DATE
      ORDER BY date ASC, time_start ASC
      LIMIT 5
    `, [id]);
    //console.log('getClubById: Upcoming events fetched. Count:', eventsResult.rows.length);

    //console.log('getClubById: Fetching recent members.');
    const membersResult = await pool.query(`
      SELECT u.id, u.name, u.profile_picture, cm.role, cm.joined_at
      FROM club_memberships cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.club_id = $1
      ORDER BY cm.joined_at DESC
      LIMIT 10
    `, [id]);
    //console.log('getClubById: Recent members fetched. Count:', membersResult.rows.length);

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
    //console.log('getClubById: Successfully sent response.');
  } catch (error) {
    console.error('getClubById: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const joinClub = async (req, res) => {
  try {
    //console.log('joinClub: Starting execution.');
    const { clubId } = req.params;
    const userId = req.user.userId;
    //console.log('joinClub: Club ID:', clubId, 'User ID:', userId);

    const clubResult = await pool.query(
      'SELECT id, name, membership_fee FROM clubs WHERE id = $1',
      [clubId]
    );
    //console.log('joinClub: Club details fetched.');

    if (clubResult.rows.length === 0) {
      //console.log('joinClub: Club not found for ID:', clubId);
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];
    //console.log('joinClub: Club name:', club.name, 'Membership fee:', club.membership_fee);

    const existingMembership = await pool.query(
      'SELECT id FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );
    //console.log('joinClub: Checked for existing membership.');

    if (existingMembership.rows.length > 0) {
      //console.log('joinClub: User is already a member.');
      return res.status(400).json({ message: 'Already a member of this club' });
    }

    if (club.membership_fee > 0) {
      //console.log('joinClub: Membership fee required, initiating payment flow.');
      return res.json({
        action: 'payment_required',
        clubId,
        fee: club.membership_fee
      });
    }

    //console.log('joinClub: No membership fee, directly adding member.');
    await pool.query(
      'INSERT INTO club_memberships (user_id, club_id, role) VALUES ($1, $2, $3)',
      [userId, clubId, 'member']
    );
    //console.log('joinClub: User successfully added as member to club:', club.name);

    res.json({
      success: true,
      message: `Successfully joined ${club.name}`
    });
    //console.log('joinClub: Successfully sent response.');
  } catch (error) {
    console.error('joinClub: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const leaveClub = async (req, res) => {
  try {
    //console.log('leaveClub: Starting execution.');
    const { clubId } = req.params;
    const userId = req.user.userId;
    //console.log('leaveClub: Club ID:', clubId, 'User ID:', userId);

    const membershipResult = await pool.query(
      'SELECT role FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );
    //console.log('leaveClub: Membership status checked.');

    if (membershipResult.rows.length === 0) {
      //console.log('leaveClub: User is not a member of this club.');
      return res.status(400).json({ message: 'Not a member of this club' });
    }

    if (membershipResult.rows[0].role === 'admin') {
      //console.log('leaveClub: User is an admin and cannot leave the club.');
      return res.status(400).json({ message: 'Club admin cannot leave the club' });
    }

    //console.log('leaveClub: Deleting membership record.');
    await pool.query(
      'DELETE FROM club_memberships WHERE user_id = $1 AND club_id = $2',
      [userId, clubId]
    );
    //console.log('leaveClub: Membership successfully deleted.');

    res.json({
      success: true,
      message: 'Successfully left the club'
    });
    //console.log('leaveClub: Successfully sent response.');
  } catch (error) {
    console.error('leaveClub: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClubCategories = async (req, res) => {
  try {
    //console.log('getClubCategories: Starting execution.');
    const result = await pool.query(
      'SELECT DISTINCT category FROM clubs WHERE category IS NOT NULL ORDER BY category'
    );
    //console.log('getClubCategories: Categories fetched from database.');

    const categories = ['All', ...result.rows.map(row => row.category)];
    //console.log('getClubCategories: Final categories list:', categories);

    res.json({
      success: true,
      categories
    });
    //console.log('getClubCategories: Successfully sent response.');
  } catch (error) {
    console.error('getClubCategories: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createClub = async (req, res) => {
  try {
    //console.log('createClub: Starting execution.');
    const {
      name,
      description,
      category,
      website,
      instagram,
      twitter,
      facebook,
      established,
      membership_fee,
      featured,
      stripe_account_id,
      stripe_account_status,
      stripe_price_id
    } = req.body;
    //console.log('createClub: Received club data:', { name, category, membership_fee });

    const userId = req.user.userId; // Get admin_id from authenticated user
    //console.log('createClub: Admin ID from authenticated user:', userId);

    let image = null;
    let cover_image = null;

    // Handle file uploads
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image = req.files.image[0].path || req.files.image[0].location || null;
        //console.log('createClub: Image file uploaded. Path:', image);
      }
      if (req.files.cover_image && req.files.cover_image[0]) {
        cover_image = req.files.cover_image[0].path || req.files.cover_image[0].location || null;
        //console.log('createClub: Cover image file uploaded. Path:', cover_image);
      }
    }

    // Handle direct image URLs from request body
    if (req.body.image && typeof req.body.image === 'string') {
      image = req.body.image;
      //console.log('createClub: Image URL from body:', image);
    }
    if (req.body.cover_image && typeof req.body.cover_image === 'string') {
      cover_image = req.body.cover_image;
      //console.log('createClub: Cover image URL from body:', cover_image);
    }

    // Validation
    if (!name || name.trim() === '') {
      //console.log('createClub: Validation error - Club name is required.');
      return res.status(400).json({
        success: false,
        message: 'Club name is required.'
      });
    }

    // Validate membership fee if provided
    const parsedMembershipFee = membership_fee ? parseFloat(membership_fee) : 0.00;
    if (parsedMembershipFee < 0) {
      //console.log('createClub: Validation error - Membership fee cannot be negative.');
      return res.status(400).json({
        success: false,
        message: 'Membership fee cannot be negative.'
      });
    }

    //console.log('createClub: Inserting new club into database.');
    const result = await pool.query(
      `INSERT INTO clubs (
        name, 
        description, 
        category, 
        image, 
        cover_image, 
        website, 
        instagram, 
        twitter, 
        facebook,
        established,
        admin_id,
        membership_fee,
        featured,
        stripe_account_id,
        stripe_account_status,
        stripe_price_id,
        rating
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        name.trim(),
        description || null,
        category || null,
        image,
        cover_image,
        website || null,
        instagram || null,
        twitter || null,
        facebook || null,
        established || null,
        0, // admin_id from authenticated user
        parsedMembershipFee,
        featured === 'true' || featured === true || false,
        stripe_account_id || null,
        stripe_account_status || 'incomplete',
        stripe_price_id || null,
        0 // Default rating
      ]
    );

    const newClub = result.rows[0];
    //console.log('createClub: New club created with ID:', newClub.id);
    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      club: newClub
    });
    //console.log('createClub: Successfully sent response.');

  } catch (error) {
    console.error('createClub: Error occurred:', error.message);

    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      console.error('createClub: Database error - Duplicate club name.');
      return res.status(400).json({
        success: false,
        message: 'A club with this name already exists.'
      });
    }

    if (error.code === '23503') { // Foreign key constraint violation
      console.error('createClub: Database error - Invalid user reference (admin_id).');
      return res.status(400).json({
        success: false,
        message: 'Invalid user reference.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating club'
    });
  }
};


export const createPaymentIntent = async (req, res) => {
  try {
    //console.log('createPaymentIntent: Starting execution.');
    const { clubId } = req.params;
    const userId = req.user.userId;
    //console.log('createPaymentIntent: Club ID:', clubId, 'User ID:', userId);

    const clubResult = await pool.query(
      'SELECT id, name, membership_fee, stripe_price_id FROM clubs WHERE id = $1',
      [clubId]
    );
    //console.log('createPaymentIntent: Club details fetched for payment intent.');

    if (clubResult.rows.length === 0) {
      //console.log('createPaymentIntent: Club not found for ID:', clubId);
      return res.status(404).json({ message: 'Club not found' });
    }

    const club = clubResult.rows[0];
    //console.log('createPaymentIntent: Club name:', club.name, 'Membership fee:', club.membership_fee);

    if (!club.membership_fee || club.membership_fee <= 0) {
      //console.log('createPaymentIntent: Club has no membership fee or fee is invalid.');
      return res.status(400).json({ message: 'This club has no membership fee' });
    }

    //console.log('createPaymentIntent: Creating Stripe payment intent.');
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(club.membership_fee * 100), // Stripe expects amount in cents
      currency: 'inr', // Assuming INR as currency
      metadata: {
        userId,
        clubId,
        clubName: club.name
      }
    });
    //console.log('createPaymentIntent: Stripe payment intent created. Client secret:', paymentIntent.client_secret);


    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: club.membership_fee
    });
    //console.log('createPaymentIntent: Successfully sent response.');
  } catch (error) {
    console.error('createPaymentIntent: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    //console.log('confirmPayment: Starting execution.');
    const { paymentIntentId } = req.body;
    const userId = req.user.userId;
    //console.log('confirmPayment: Payment Intent ID:', paymentIntentId, 'User ID:', userId);

    //console.log('confirmPayment: Retrieving Stripe payment intent.');
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    //console.log('confirmPayment: Payment Intent status:', paymentIntent.status);

    if (paymentIntent.status !== 'succeeded') {
      //console.log('confirmPayment: Payment not succeeded. Status:', paymentIntent.status);
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const { clubId } = paymentIntent.metadata;
    //console.log('confirmPayment: Payment succeeded. Extracting clubId from metadata:', clubId);

    //console.log('confirmPayment: Adding user to club membership.');
    await pool.query(
      'INSERT INTO club_memberships (user_id, club_id, role) VALUES ($1, $2, $3)',
      [userId, clubId, 'member']
    );
    //console.log('confirmPayment: User successfully added to club membership.');

    res.json({
      success: true,
      message: 'Payment confirmed and membership activated'
    });
    //console.log('confirmPayment: Successfully sent response.');
  } catch (error) {
    console.error('confirmPayment: Error occurred:', error.message);
    res.status(500).json({ success: false, message: 'Payment confirmation failed' });
  }
};

export const getClubRevenue = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const result = await pool.query(
      `SELECT e.id as event_id, e.title as event_title, e.date,
              SUM(er.amount_paid) as event_revenue,
              COUNT(er.user_id) as registrations_count
       FROM events e
       LEFT JOIN event_registrations er ON e.id = er.event_id 
       WHERE e.club_id = $1 AND er.payment_status = 'completed'
       GROUP BY e.id, e.title, e.date
       ORDER BY e.date DESC`,
      [clubId]
    );

    // Calculate total club revenue
    const totalClubRevenue = result.rows.reduce((sum, event) => sum + (parseFloat(event.event_revenue) || 0), 0);

    res.json({ 
      success: true, 
      events: result.rows,
      totalRevenue: totalClubRevenue
    });
  } catch (error) {
    console.error('Get club revenue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClubAttendance = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    // Count total attendees (where is_present = true) for all events of this club
    const result = await pool.query(`
      SELECT COUNT(*) as total_attended
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE e.club_id = $1 AND er.is_present = true
    `, [clubId]);

    const totalAttended = parseInt(result.rows[0].total_attended) || 0;

    res.json({
      success: true,
      total_attended: totalAttended,
      club_id: clubId
    });
  } catch (error) {
    console.error('Get club attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getAllClubsRevenue = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id as club_id, c.name as club_name,
              SUM(er.amount_paid) as total_revenue,
              COUNT(DISTINCT e.id) as events_count,
              COUNT(er.user_id) as total_registrations
       FROM clubs c
       LEFT JOIN events e ON c.id = e.club_id
       LEFT JOIN event_registrations er ON e.id = er.event_id AND er.payment_status = 'completed'
       GROUP BY c.id, c.name
       ORDER BY total_revenue DESC NULLS LAST`
    );

    res.json({ 
      success: true, 
      clubs: result.rows
      
    });
  } catch (error) {
    console.error('Get all clubs revenue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
