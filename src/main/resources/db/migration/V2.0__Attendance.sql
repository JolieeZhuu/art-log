CREATE TABLE if not exists artLog.attendance (
attendance_id SERIAL PRIMARY KEY,
student_id integer references student(student_id),
payment_number integer,
class_number integer,
date_expected varchar(250),
attendance_check varchar(250),
date_attended varchar(250),
check_in varchar(250),
hours integer,
check_out varchar(250),
notes varchar(250)
);