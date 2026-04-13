CREATE TABLE IF NOT EXISTS artlog.role (
    role_id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    role_desc TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);