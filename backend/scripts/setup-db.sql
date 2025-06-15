-- Create database
CREATE DATABASE unisphere;

-- Create user (optional)
CREATE USER unisphere_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE unisphere TO unisphere_user;
