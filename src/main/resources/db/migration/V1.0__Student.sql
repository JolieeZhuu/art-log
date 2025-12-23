CREATE SCHEMA IF NOT EXISTS artlog;

CREATE TABLE IF NOT EXISTS artlog.student (
    student_id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    class_id TEXT,
    day TEXT,
    phone_number TEXT,
    time_expected TIME,
    general_notes TEXT DEFAULT 'General Notes',
    curr_table INTEGER,
    curr_class INTEGER,
    class_hours FLOAT
);