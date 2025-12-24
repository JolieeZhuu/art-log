CREATE TABLE IF NOT EXISTS artlog.term (
    term_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES student(student_id),
    total_classes INTEGER,
    payment_notes TEXT DEFAULT 'Payment Notes',
    term_notes TEXT DEFAULT 'Term Notes',
    table_num INTEGER
);