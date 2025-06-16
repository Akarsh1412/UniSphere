import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import authConfig from '../config/auth.js';
import { validateEmail, validatePassword } from '../utils/helpers.js';

const { jwtSecret, jwtExpire, bcryptSaltRounds } = authConfig;

const generateToken = (userId, type = 'access') => {
  return jwt.sign({ userId, type }, jwtSecret, { expiresIn: jwtExpire });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, registrationNumber, profilePicture } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR registration_number = $2',
      [email, registrationNumber]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email or registration number already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, registration_number, profile_picture) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, profile_picture, registration_number, role, created_at`,
      [name, email, hashedPassword, registrationNumber, profilePicture]
    );
    
    const user = result.rows[0];
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationNumber: user.registration_number,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Registration number and password are required' });
    }
    
    // Find user by email or registration number
    const result = await pool.query(
      `SELECT id, name, email, password_hash, profile_picture, registration_number, role 
       FROM users WHERE email = $1 OR registration_number = $1`,
      [identifier]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationNumber: user.registration_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;
    if (!admin_id || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    const result = process.env.ADMIN_ID === admin_id && process.env.ADMIN_PASSWORD === password;
    if (result) {
      // Successful admin login
      const token = generateToken({ userId: admin_id, role: 'admin' });
      res.json({
        success: true,
        message: 'Admin login successful',
        token
      });
    } else {
      // Failed admin login
      res.status(401).json({ message: 'Invalid Admin ID or Password' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The authenticateToken middleware has already verified the token
    // and set req.user with basic user info
    const userId = req.user.userId;

    // Fetch complete user data from database
    const result = await pool.query(
      `SELECT id, name, email, profile_picture, registration_number, role, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = result.rows[0];
    
    // Return user data in the expected format
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationNumber: user.registration_number,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during token verification' 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(
      `SELECT id, name, email, profile_picture, registration_number, role, created_at
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
