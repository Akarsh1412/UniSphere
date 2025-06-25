import pool from '../config/database.js';
import stripe from 'stripe';
import authConfig from '../config/auth.js';
const stripeClient = stripe(authConfig.stripeSecret);

export const createEventPaymentIntent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    // 1. Validate event exists
    const eventResult = await pool.query(`
      SELECT e.price, e.currency, c.stripe_account_id
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.id = $1
    `, [eventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = eventResult.rows[0];

    // 2. Validate payment requirements
    if (!event.price || event.price <= 0) {
      return res.status(400).json({ message: 'Event is free' });
    }
    if (!event.stripe_account_id) {
      return res.status(400).json({ message: 'Club Stripe account not set up' });
    }
    if (!event.stripe_account_id.startsWith('acct_')) {
      return res.status(400).json({ message: 'Invalid Stripe account ID' });
    }

    // 3. Create PaymentIntent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(event.price * 100),
      currency: event.currency || 'inr',
      payment_method_types: ['card'],
      transfer_data: {
        destination: event.stripe_account_id,
      },
      metadata: { userId, eventId }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('PaymentIntent Error:', error);
    res.status(500).json({
      success: false,
      message: 'PaymentIntent creation failed',
      error: error.message // Include Stripe error details
    });
  }
};


export const confirmEventPaymentAndRegister = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.userId;

    // Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const { eventId } = paymentIntent.metadata;

    // Register user for event
    await pool.query(`
      INSERT INTO event_registrations
      (user_id, event_id, registration_type, payment_status, payment_method,amount_paid, stripe_payment_intent_id)
      VALUES ($1, $2, $3, $4, $5, $6,$7)
    `, [
      userId,
      eventId,
      'participant',
      'completed',
      'stripe',
      paymentIntent.amount / 100,
      paymentIntentId
    ]);

    res.json({ success: true, message: 'Registration and payment successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment confirmation failed' });
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const { club, search, featured, upcoming, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT e.*, c.name as club_name, c.image as club_image,
             COUNT(DISTINCT er.user_id) FILTER (WHERE er.registration_type = 'participant') as registrations_count 
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
    `;
    
    const params = [];
    const conditions = [];
    
    if (club && club !== 'All') {
      conditions.push(`c.name = $${params.length + 1}`);
      params.push(club);
    }
    
    if (search) {
      conditions.push(`(e.title ILIKE $${params.length + 1} OR e.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (featured === 'true') {
      conditions.push('e.featured = true');
    }
    
    if (upcoming === 'true') {
      conditions.push('e.date >= CURRENT_DATE');
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY e.id, c.name, c.image 
               ORDER BY e.featured DESC, e.date ASC, e.time_start ASC`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM events e LEFT JOIN clubs c ON e.club_id = c.id';
    const countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
      for (let i = 0; i < params.length - 2; i++) {
        countParams.push(params[i]);
      }
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const totalEvents = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      events: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalEvents,
        hasNext: page * limit < totalEvents,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const result = await pool.query(`
      SELECT e.*, c.name as club_name, c.image as club_image, c.id as club_id,
             COUNT(DISTINCT er.user_id) FILTER (WHERE er2.registration_type = 'participant') as registrations_count,
             COUNT(DISTINCT er2.user_id) FILTER (WHERE er2.registration_type = 'volunteer') as volunteers_count
      FROM events e
      LEFT JOIN clubs c ON e.club_id = c.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      LEFT JOIN event_registrations er2 ON e.id = er2.event_id
      WHERE e.id = $1
      GROUP BY e.id, c.name, c.image, c.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = result.rows[0];
    
    // Check if user is registered
    let isRegistered = false;
    let registrationType = null;
    
    if (userId) {
      const registrationResult = await pool.query(
        'SELECT registration_type FROM event_registrations WHERE user_id = $1 AND event_id = $2',
        [userId, id]
      );
      
      if (registrationResult.rows.length > 0) {
        isRegistered = true;
        registrationType = registrationResult.rows[0].registration_type;
      }
    }
    
    res.json({
      success: true,
      event: {
        ...event,
        isRegistered,
        registrationType
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registrationType, paymentMethod, amount } = req.body;
    const userId = req.user.userId;
    
    // Check if event exists and get details
    const eventResult = await pool.query(
      'SELECT title, price, capacity, date FROM events WHERE id = $1',
      [eventId]
    );
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const event = eventResult.rows[0];
    
    // Check if event has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }
    
    // Check if already registered
    const existingRegistration = await pool.query(
      'SELECT id FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Check capacity
    if (registrationType === 'participant') {
      if (event.capacity) {
        const registrationCount = await pool.query(
          'SELECT COUNT(*) FROM event_registrations WHERE event_id = $1',
          [eventId]
        );

        if (parseInt(registrationCount.rows[0].count) >= event.capacity) {
          return res.status(400).json({ message: 'Event is at full capacity' });
        }
      }
    } else if (registrationType === 'volunteer') {
      // Check if volunteers needed
      if (event.volunteers_needed) {
        const volunteerCount = await pool.query(
          'SELECT COUNT(*) FROM event_registrations WHERE event_id = $1 AND registration_type = $2',
          [eventId, 'volunteer']
        );

        if (parseInt(volunteerCount.rows[0].count) >= event.volunteers_needed) {
          return res.status(400).json({ message: 'No more volunteer spots available' });
        }
      }
    }
    
    // Determine payment status
    let paymentStatus = 0;
    let amountPaid = 0;

    if (registrationType === 'participant') {
      paymentStatus = event.price > 0 ? 'pending' : 'completed';
      amountPaid = event.price > 0 ? (amount || event.price) : 0;
    }

    // Register for event
    await pool.query(`
      INSERT INTO event_registrations 
      (user_id, event_id, registration_type, payment_method, amount_paid, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, eventId, registrationType, paymentMethod, amountPaid, paymentStatus]);
    
    res.json({ 
      success: true, 
      message: `Successfully registered for ${event.title} as ${registrationType}` 
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;
    
    // Check if registered
    const registrationResult = await pool.query(
      'SELECT id FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    if (registrationResult.rows.length === 0) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }
    
    // Remove registration
    await pool.query(
      'DELETE FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    
    res.json({ 
      success: true, 
      message: 'Successfully unregistered from event' 
    });
  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type = 'all' } = req.query; // all, upcoming, past
    
    let dateCondition = '';
    if (type === 'upcoming') {
      dateCondition = 'AND e.date >= CURRENT_DATE';
    } else if (type === 'past') {
      dateCondition = 'AND e.date < CURRENT_DATE';
    }
    
    const result = await pool.query(`
      SELECT e.*, c.name as club_name, er.registration_type, er.registered_at, er.payment_status
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      JOIN clubs c ON e.club_id = c.id
      WHERE er.user_id = $1 ${dateCondition}
      ORDER BY e.date DESC, e.time_start DESC
    `, [userId]);
    
    res.json({
      success: true,
      events: result.rows
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      club_id,
      date,
      time_start,
      time_end,
      venue,
      price,
      volunteers_needed,
      capacity,
      description,
      guests,
      coordinators,
      schedule,
      requirements
    } = req.body;

    // ...validation code...

    const image = req.body.image || null;

    const clubResult = await pool.query('SELECT id FROM clubs WHERE id = $1', [club_id]);
    if (clubResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Club not found.' });
    }

    let parsedGuests, parsedCoordinators, parsedSchedule, parsedRequirements;
    try {
      parsedGuests = guests ? JSON.parse(guests) : [];
      parsedCoordinators = coordinators ? JSON.parse(coordinators) : [];
      parsedSchedule = schedule ? JSON.parse(schedule) : [];
      parsedRequirements = requirements ? JSON.parse(requirements) : [];
    } catch (parseError) {
      return res.status(400).json({ success: false, message: 'Invalid JSON data in request.' });
    }

    // Use safe parsing helpers for numbers as before
    const safeParseInt = (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    };
    const safeParseFloat = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const newEvent = await pool.query(
      `INSERT INTO events (
        title, club_id, date, time_start, time_end, venue, price, 
        volunteers_needed, capacity, image, description, guests, 
        coordinators, schedule, requirements
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        title,
        club_id,
        date,
        time_start,
        time_end,
        venue,
        safeParseFloat(price),
        safeParseInt(volunteers_needed),
        safeParseInt(capacity),
        image,
        description,
        JSON.stringify(parsedGuests),
        JSON.stringify(parsedCoordinators),
        JSON.stringify(parsedSchedule),
        JSON.stringify(parsedRequirements)
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event: newEvent.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating event' });
  }
};
export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        er.user_id, 
        er.is_present, 
        er.amount_paid,
        er.payment_status,
        er.registered_at,
        u.name, 
        u.email, 
        u.registration_number,
        e.price as event_price,
        COALESCE(er.amount_paid, e.price) as calculated_amount_paid
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      JOIN events e ON er.event_id = e.id
      WHERE er.event_id = $1 and er.registration_type = 'participant'
      ORDER BY u.name`,
      [id]
    );

    res.json({ success: true, registrations: result.rows });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventVolunteers = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        er.user_id, 
        er.is_present, 
        er.amount_paid,
        er.payment_status,
        er.registered_at,
        u.name, 
        u.email, 
        u.registration_number,
        e.price as event_price,
        COALESCE(er.amount_paid, e.price) as calculated_amount_paid
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      JOIN events e ON er.event_id = e.id
      WHERE er.event_id = $1 and er.registration_type = 'volunteer'
      ORDER BY u.name`,
      [id]
    );

    res.json({ success: true, volunteers: result.rows });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const attendees = req.body.attendees; // Expects an array: [{ userId, isPresent }]

  if (!Array.isArray(attendees)) {
    return res.status(400).json({ success: false, message: 'Invalid data format. Expected an array of attendees.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update each user's attendance status in event_registrations
    for (const attendee of attendees) {
      await client.query(
        'UPDATE event_registrations SET is_present = $1 WHERE event_id = $2 AND user_id = $3',
        [attendee.isPresent, id, attendee.userId]
      );
    }

    // Recalculate the total number of present attendees
    const presentCountResult = await client.query(
      'SELECT COUNT(*) FROM event_registrations WHERE event_id = $1 AND is_present = TRUE',
      [id]
    );
    const presentCount = parseInt(presentCountResult.rows[0].count, 10);

    // Update the attendance column in the events table
    await client.query('UPDATE events SET attendance = $1 WHERE id = $2', [presentCount, id]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Attendance updated successfully.', newAttendanceCount: presentCount });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating attendance' });
  } finally {
    client.release();
  }
};


export const getEventRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT er.user_id, er.amount_paid, er.payment_status, er.registered_at,
              u.name, u.email, u.registration_number
       FROM event_registrations er
       JOIN users u ON er.user_id = u.id
       WHERE er.event_id = $1 AND er.payment_status = 'completed'
       ORDER BY er.registered_at DESC`,
      [id]
    );

    // Calculate total revenue for this event
    const totalRevenue = result.rows.reduce((sum, reg) => sum + (parseFloat(reg.amount_paid) || 0), 0);

    res.json({ 
      success: true, 
      registrations: result.rows,
      totalRevenue,
      registrationCount: result.rows.length
    });
  } catch (error) {
    console.error('Get event revenue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

