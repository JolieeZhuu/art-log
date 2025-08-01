CREATE TABLE if not exists artLog.attendance (
attendance_id SERIAL PRIMARY KEY,
student_id integer references student(student_id),
payment_number integer,
class_number integer,
date_expected date,
attendance_check varchar(250),
date_attended date,
check_in varchar(250),
hours integer,
check_out varchar(250),
notes varchar(250)
);