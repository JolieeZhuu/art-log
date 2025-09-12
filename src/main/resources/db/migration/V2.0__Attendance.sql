CREATE TABLE IF NOT EXISTS artlog.attendance (
	attendance_id SERIAL PRIMARY KEY,
	student_id INTEGER REFERENCES student(student_id),
	payment_number INTEGER,
	class_number INTEGER,
	date_expected DATE,
	attendance_check TEXT,
	date_attended DATE,
	check_in TIME,
	hours INTEGER,
	check_out TIME,
	payment_notes TEXT DEFAULT 'Payment Notes',
	term_notes TEXT DEFAULT 'Term Notes',
	notes TEXT DEFAULT 'Notes'
);