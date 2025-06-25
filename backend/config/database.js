import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    // Remove the ca certificate requirement for now
    // ca: process.env.DB_CA_CERT
  }
});

// Test connection
pool.on('connect', () => {});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export default pool;
