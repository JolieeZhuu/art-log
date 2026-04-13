CREATE TABLE IF NOT EXISTS artlog.user_role (
    user_role_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES artlog.user(user_id),
    role_id INTEGER REFERENCES role(role_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);