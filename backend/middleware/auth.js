import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';
import pool from '../config/database.js';

const { jwtSecret } = authConfig;

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    
    // Verify user still exists
    const userResult = await pool.query(
      'SELECT id, role, verified FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = {
      userId: decoded.userId,
      role: userResult.rows[0].role,
      verified: userResult.rows[0].verified
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, jwtSecret);
      const userResult = await pool.query(
        'SELECT id, role, verified FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length > 0) {
        req.user = {
          userId: decoded.userId,
          role: userResult.rows[0].role,
          verified: userResult.rows[0].verified
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};

export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  if (!req.user.verified) {
    return res.status(403).json({ 
      success: false, 
      message: 'Account verification required' 
    });
  }
  
  next();
};
