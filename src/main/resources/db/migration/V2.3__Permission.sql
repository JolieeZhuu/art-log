CREATE TABLE IF NOT EXISTS artlog.permission (
    permission_id SERIAL PRIMARY KEY,
    permission_name TEXT UNIQUE NOT NULL,
    permission_desc TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);