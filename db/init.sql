create database if not exists group_db;
use group_db;

CREATE TABLE student (
  id int PRIMARY KEY AUTO_INCREMENT,
  uuid_code varchar(32) NOT NULL,
  email varchar(255) NOT NULL,
  full_name varchar(255) NOT NULL,
  -- average_score float4,
  group_collection_id int NOT NULL,
  group_id int
);

CREATE TABLE group_collection (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  starting_year int NOT NULL,
  owner_id int NOT NULL,
  config_id int NOT NULL
);

CREATE TABLE stud_group (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  collection_id int,
  max_seats int NOT NULL,
  occupied_seats int NOT NULL
);

CREATE TABLE user_account (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) UNIQUE,
  password_hash varchar(255),
  role ENUM ('organizer', 'admin')
);

-- todo: move this in group collection
CREATE TABLE configuration (
  id int PRIMARY KEY AUTO_INCREMENT,
  join_allowed BOOLEAN,
  completion_strategy ENUM ('RANDOM', 'KEEP_AVERAGE_SCORE', 'UNIFORM_SCORE', 'SORTED_SCORE')
);

ALTER TABLE student ADD FOREIGN KEY (group_id) REFERENCES stud_group (id);

ALTER TABLE student ADD FOREIGN KEY (group_collection_id) REFERENCES group_collection (id);

ALTER TABLE group_collection ADD FOREIGN KEY (owner_id) REFERENCES user (id);

ALTER TABLE group_collection ADD FOREIGN KEY (config_id) REFERENCES configuration (id);

ALTER TABLE stud_group ADD FOREIGN KEY (collection_id) REFERENCES group_collection (id);

