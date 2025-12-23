CREATE TABLE IF NOT EXISTS artlog.user (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    verification_code TEXT,
    verification_code_expiration TIMESTAMP 
);