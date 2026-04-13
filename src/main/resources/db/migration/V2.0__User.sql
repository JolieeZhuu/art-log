CREATE TABLE IF NOT EXISTS artlog.user (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    verification_code TEXT,
    verification_code_expiration TIMESTAMP,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);