CREATE TABLE IF NOT EXISTS artlog.activity (
    activity_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES artlog.user(user_id),
    entity_id INTEGER,
    action_type VARCHAR(25),
    entity_table VARCHAR(50),
    payload JSON,
    created_at TIMESTAMP
);