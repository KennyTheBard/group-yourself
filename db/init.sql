CREATE TABLE student (
  id int PRIMARY KEY AUTO_INCREMENT,
  first_name varchar(255),
  last_name varchar(255),
  father_initials varchar(255),
  high_school varchar(255),
  town varchar(255),
  country_code varchar(255),
  average_score float4,
  group_id int
);

CREATE TABLE specialization (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255),
  manager_id int,
  config_id int
);

CREATE TABLE stud_group (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255),
  starting_year int,
  spec_id int,
  max_seats int
);

CREATE TABLE user_account (
  id int PRIMARY KEY AUTO_INCREMENT,
  student_id int,
  email varchar(255) UNIQUE,
  password_hash varchar(255)
);

CREATE TABLE manager (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(255),
  password_hash varchar(255)
);

CREATE TABLE configuration (
  id int PRIMARY KEY AUTO_INCREMENT,
  join_allowed BOOLEAN,
  strategy_used ENUM ('RANDOM', 'KEEP_AVERAGE_SCORE', 'UNIFORM_SCORE', 'SORTED_SCORE')
);

ALTER TABLE student ADD FOREIGN KEY (group_id) REFERENCES stud_group (id);

ALTER TABLE specialization ADD FOREIGN KEY (manager_id) REFERENCES manager (id);

ALTER TABLE specialization ADD FOREIGN KEY (config_id) REFERENCES configuration (id);

ALTER TABLE stud_group ADD FOREIGN KEY (spec_id) REFERENCES specialization (id);

ALTER TABLE user_account ADD FOREIGN KEY (student_id) REFERENCES student (id);