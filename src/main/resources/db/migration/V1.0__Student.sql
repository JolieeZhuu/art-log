CREATE SCHEMA IF NOT EXISTS artLog;

CREATE TABLE if not exists artLog.student (
student_id SERIAL PRIMARY KEY,
first_name varchar(250),
last_name varchar(250),
class_id varchar(250),
day varchar(250),
phone_number varchar(250),
payment_notes varchar(250),
notes varchar(250),
payment_number integer,
class_number integer,
time_expected varchar(250)
);