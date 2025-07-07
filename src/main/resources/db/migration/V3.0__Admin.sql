CREATE TABLE if not exists artLog.admin (
admin_id SERIAL PRIMARY KEY,
first_name varchar(250),
last_name varchar(250),
username varchar(250),
password varchar(250),
role varchar(250)
);