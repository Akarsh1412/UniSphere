-- =====================================================
-- Complete Database Schema for Club Event Registration System
-- Updated: June 23, 2025
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(500),
    registration_number VARCHAR(100) UNIQUE,
    role VARCHAR(50) DEFAULT 'student',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clubs table with Stripe integration
CREATE TABLE IF NOT EXISTS clubs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image TEXT,
    cover_image TEXT,
    featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    established TEXT,
    admin_id INTEGER REFERENCES users(id),
    website TEXT,
    instagram TEXT,
    twitter TEXT,
    facebook TEXT,
    stripe_account_id VARCHAR(255),
    stripe_account_status VARCHAR(50) DEFAULT 'incomplete',
    stripe_price_id VARCHAR(255),
    membership_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club memberships
CREATE TABLE IF NOT EXISTS club_memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    club_id INTEGER REFERENCES clubs(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, club_id)
);

-- Events table with full feature support
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    club_id INTEGER REFERENCES clubs(id),
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME,
    venue TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    capacity INTEGER,
    attendance INTEGER DEFAULT 0,
    volunteers_needed INTEGER DEFAULT 0,
    notification_email VARCHAR(255),
    image TEXT,
    featured BOOLEAN DEFAULT false,
    guests TEXT,
    coordinators TEXT,
    schedule TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations with payment tracking
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    registration_type VARCHAR(50) DEFAULT 'participant',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    amount_paid DECIMAL(10,2),
    stripe_payment_intent_id VARCHAR(255),
    is_present BOOLEAN NOT NULL DEFAULT false,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- Payment transactions for detailed tracking
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    club_id INTEGER REFERENCES clubs(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'pending',
    platform_fee DECIMAL(10,2) DEFAULT 0,
    club_earnings DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club earnings summary
CREATE TABLE IF NOT EXISTS club_earnings (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    event_id INTEGER REFERENCES events(id),
    total_registrations INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    platform_fees DECIMAL(10,2) DEFAULT 0,
    net_earnings DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_id, event_id)
);

-- Social features - Posts
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    image VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes on posts
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Direct messaging system
CREATE TABLE IF NOT EXISTS direct_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration tracking (if using migrations)
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_registration_number ON users(registration_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Club indexes
CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs(category);
CREATE INDEX IF NOT EXISTS idx_clubs_featured ON clubs(featured);
CREATE INDEX IF NOT EXISTS idx_clubs_admin_id ON clubs(admin_id);
CREATE INDEX IF NOT EXISTS idx_clubs_stripe_account ON clubs(stripe_account_id);

-- Event indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_events_price ON events(price);

-- Event registration indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_stripe_payment_intent ON event_registrations(stripe_payment_intent_id);

-- Club membership indexes
CREATE INDEX IF NOT EXISTS idx_club_memberships_user_id ON club_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_club_memberships_club_id ON club_memberships(club_id);

-- Payment transaction indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_event_id ON payment_transactions(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_club_id ON payment_transactions(club_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_intent ON payment_transactions(stripe_payment_intent_id);

-- Club earnings indexes
CREATE INDEX IF NOT EXISTS idx_club_earnings_club_id ON club_earnings(club_id);
CREATE INDEX IF NOT EXISTS idx_club_earnings_event_id ON club_earnings(event_id);

-- Social feature indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Direct message indexes
CREATE INDEX IF NOT EXISTS idx_dm_sender_receiver ON direct_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_dm_created_at ON direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_dm_is_read ON direct_messages(is_read);

-- =====================================================
-- CONSTRAINTS AND CHECKS
-- =====================================================

-- Add data validation constraints
ALTER TABLE events ADD CONSTRAINT IF NOT EXISTS chk_events_price_positive CHECK (price >= 0);
ALTER TABLE events ADD CONSTRAINT IF NOT EXISTS chk_events_capacity_positive CHECK (capacity > 0 OR capacity IS NULL);
ALTER TABLE events ADD CONSTRAINT IF NOT EXISTS chk_events_attendance_positive CHECK (attendance >= 0);

ALTER TABLE clubs ADD CONSTRAINT IF NOT EXISTS chk_clubs_membership_fee_positive CHECK (membership_fee >= 0);
ALTER TABLE clubs ADD CONSTRAINT IF NOT EXISTS chk_clubs_rating_range CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE event_registrations ADD CONSTRAINT IF NOT EXISTS chk_event_registrations_amount_positive CHECK (amount_paid >= 0 OR amount_paid IS NULL);

ALTER TABLE payment_transactions ADD CONSTRAINT IF NOT EXISTS chk_payment_transactions_amount_positive CHECK (amount > 0);
ALTER TABLE payment_transactions ADD CONSTRAINT IF NOT EXISTS chk_payment_transactions_platform_fee_positive CHECK (platform_fee >= 0);

ALTER TABLE club_earnings ADD CONSTRAINT IF NOT EXISTS chk_club_earnings_positive CHECK (
    total_registrations >= 0 AND 
    total_earnings >= 0 AND 
    platform_fees >= 0 AND 
    net_earnings >= 0
);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- END OF SCHEMA
-- =====================================================
