CREATE TABLE IF NOT EXISTS artlog.permission_role (
    permission_role_id SERIAL PRIMARY KEY,
    permission_id INTEGER REFERENCES permission(permission_id),
    role_id INTEGER REFERENCES role(role_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);