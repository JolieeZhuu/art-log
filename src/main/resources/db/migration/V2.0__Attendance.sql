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
	notes TEXT
);