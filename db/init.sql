DROP DATABASE IF EXISTS group_db;
CREATE DATABASE group_db;
USE group_db;
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('password');
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON group_db.* TO 'user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE user_account (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) UNIQUE,
  password_hash varchar(255),
  role ENUM ('organizer', 'admin')
) ENGINE INNODB;

CREATE TABLE group_collection (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  starting_year int NOT NULL,
  owner_id int NOT NULL,
  join_allowed BOOLEAN NOT NULL,
  completion_strategy ENUM (
    'RANDOM',
    'KEEP_AVERAGE_SCORE',
    'UNIFORM_SCORE',
    'SORTED_SCORE'
  ) NOT NULL DEFAULT 'RANDOM'
) ENGINE INNODB;

CREATE TABLE stud_group (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  collection_id int,
  max_seats int NOT NULL,
  occupied_seats int NOT NULL
) ENGINE INNODB;

CREATE TABLE student (
  id int PRIMARY KEY AUTO_INCREMENT,
  uuid_code varchar(32) NOT NULL,
  email varchar(255) NOT NULL,
  full_name varchar(255) NOT NULL,
  -- average_score float4,
  group_collection_id int NOT NULL,
  group_id int
) ENGINE INNODB;

-- ALTER TABLE student ADD INDEX student_group_id (group_id);
ALTER TABLE student ADD FOREIGN KEY (group_id) REFERENCES stud_group(id);

-- ALTER TABLE student ADD INDEX student_group_collection_id (group_collection_id);
ALTER TABLE student ADD FOREIGN KEY (group_collection_id) REFERENCES group_collection(id);

-- ALTER TABLE group_collection ADD INDEX group_collection_owner_id (owner_id);
ALTER TABLE group_collection ADD FOREIGN KEY (owner_id) REFERENCES user_account(id);

-- ALTER TABLE stud_group ADD INDEX stud_group_collection_id (collection_id);
ALTER TABLE stud_group ADD FOREIGN KEY (collection_id) REFERENCES group_collection(id);

-- user_account table
INSERT INTO user_account
  (email, password_hash, role)
VALUES
  ('admin@faculty.com', '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935', 'admin'), -- id 1
  ('organizer@faculty.com', '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba187', 'organizer'); -- id 2

-- group_collection table | Cele 2 serii: CA si CB
INSERT INTO group_collection
  (name, starting_year, owner_id, join_allowed, completion_strategy)
VALUES
  ('CA', 2021, 1, true, 'RANDOM'); -- id 1
  -- ('CB', 2021, 1, true, 'RANDOM'); -- id 2

-- stud_group table | Cate 5 grupe pentru fiecare serie
INSERT INTO stud_group
  (name, collection_id, max_seats, occupied_seats)
VALUES
  ('311', 1, 25, 10), -- id 1 | group 311CA
  ('312', 1, 25, 10), -- id 2 | group 312CA
  ('313', 1, 25, 10), -- id 3 | group 313CA
  ('314', 1, 25, 10), -- id 4 | group 314CA
  ('315', 1, 25, 10); -- id 5 | group 315CA
  -- ('311', 2, 25, 0), -- id 6 | group 311CB
  -- ('312', 2, 25, 0), -- id 7 | group 312CB
  -- ('313', 2, 25, 0), -- id 8 | group 313CB
  -- ('314', 2, 25, 0), -- id 9 | group 314CB
  -- ('315', 2, 25, 0); -- id 10 | group 315CB

-- student table | 2 serii, fiecare cu cate 5 grupe, iar fiecare grupa are 10 studenti
INSERT INTO student
  (uuid_code, email, full_name, group_collection_id, group_id)
VALUES
  ('12345678901234567890123456789012', 'anghel.vulcan@faculty.com', 'Anghel Vulcan', 1, 1),
  ('12345678901234567890123456789012', 'octavia.albu@faculty.com', 'Octavia Albu', 1, 1),
  ('12345678901234567890123456789012', 'iosif.pavlenco@faculty.com', 'Iosif Pavlenco', 1, 1),
  ('12345678901234567890123456789012', 'nandru.mitu@faculty.com', 'Nandru Mitu', 1, 1),
  ('12345678901234567890123456789012', 'valeria.zaituc@faculty.com', 'Valeria Zaituc', 1, 1),
  ('12345678901234567890123456789012', 'vali.amanar@faculty.com', 'Vali Amanar', 1, 1),
  ('12345678901234567890123456789012', 'gogu.cocis@faculty.com', 'Gogu Cocis', 1, 1),
  ('12345678901234567890123456789012', 'adam.mihaili@faculty.com', 'Adam Mihaili', 1, 1),
  ('12345678901234567890123456789012', 'tara.barnutiu@faculty.com', 'Tara Barnutiu', 1, 1),
  ('12345678901234567890123456789012', 'mihaela.adamache@faculty.com', 'Mihaela Adamache', 1, 1),
  ('12345678901234567890123456789012', 'flavius.jonker@faculty.com', 'Flavius Jonker', 1, 2),
  ('12345678901234567890123456789012', 'octavian.moldovan@faculty.com', 'Octavian Moldovan', 1, 2),
  ('12345678901234567890123456789012', 'toma.bogza@faculty.com', 'Toma Bogza', 1, 2),
  ('12345678901234567890123456789012', 'costea.banica@faculty.com', 'Costea Banica', 1, 2),
  ('12345678901234567890123456789012', 'shaithis.catargiu@faculty.com', 'Shaithis Catargiu', 1, 2),
  ('12345678901234567890123456789012', 'amelia.tilea@faculty.com', 'Amelia Tilea', 1, 2),
  ('12345678901234567890123456789012', 'sergiu.musat@faculty.com', 'Sergiu Musat', 1, 2),
  ('12345678901234567890123456789012', 'dorina.ciora@faculty.com', 'Dorina Ciora', 1, 2),
  ('12345678901234567890123456789012', 'ciprian.nicolescu@faculty.com', 'Ciprian Nicolescu', 1, 2),
  ('12345678901234567890123456789012', 'anamaria.ilionescu@faculty.com', 'Anamaria Ilionescu', 1, 2),
  ('12345678901234567890123456789012', 'mihai.checiches@faculty.com', 'Mihai Checiches', 1, 3),
  ('12345678901234567890123456789012', 'vladimir.cosmescu@faculty.com', 'Vladimir Cosmescu', 1, 3),
  ('12345678901234567890123456789012', 'silviu.nica@faculty.com', 'Silviu Nica', 1, 3),
  ('12345678901234567890123456789012', 'geza.hurgoi@faculty.com', 'Geza Hurgoi', 1, 3),
  ('12345678901234567890123456789012', 'anca.korzha@faculty.com', 'Anca Korzha', 1, 3),
  ('12345678901234567890123456789012', 'laurentia.rudeanu@faculty.com', 'Laurentia Rudeanu', 1, 3),
  ('12345678901234567890123456789012', 'valerian.skutnik@faculty.com', 'Valerian Skutnik', 1, 3),
  ('12345678901234567890123456789012', 'michaela.dalca@faculty.com', 'Michaela Dalca', 1, 3),
  ('12345678901234567890123456789012', 'ruxandra.pangratiu@faculty.com', 'Ruxandra Pangratiu', 1, 3),
  ('12345678901234567890123456789012', 'marilena.tomoiaga@faculty.com', 'Marilena Tomoiaga', 1, 3),
  ('12345678901234567890123456789012', 'marcel.rotaru@faculty.com', 'Marcel Rotaru', 1, 4),
  ('12345678901234567890123456789012', 'helga.macek@faculty.com', 'Helga Macek', 1, 4),
  ('12345678901234567890123456789012', 'daniel.cornea@faculty.com', 'Daniel Cornea', 1, 4),
  ('12345678901234567890123456789012', 'laurentiu.puiu@faculty.com', 'Laurentiu Puiu', 1, 4),
  ('12345678901234567890123456789012', 'ionela.lupei@faculty.com', 'Ionela Lupei', 1, 4),
  ('12345678901234567890123456789012', 'sebastian.craciun@faculty.com', 'Sebastian Craciun', 1, 4),
  ('12345678901234567890123456789012', 'mihaita.ungureanu@faculty.com', 'Mihaita Ungureanu', 1, 4),
  ('12345678901234567890123456789012', 'ionatan.vulpes@faculty.com', 'Ionatan Vulpes', 1, 4),
  ('12345678901234567890123456789012', 'angela.lascar@faculty.com', 'Angela Lascar', 1, 4),
  ('12345678901234567890123456789012', 'jean.rosetti@faculty.com', 'Jean Rosetti', 1, 4),
  ('12345678901234567890123456789012', 'olympia.predoiu@faculty.com', 'Olympia Predoiu', 1, 5),
  ('12345678901234567890123456789012', 'marta.mihalache@faculty.com', 'Marta Mihalache', 1, 5),
  ('12345678901234567890123456789012', 'zana.izbasa@faculty.com', 'Zana Izbasa', 1, 5),
  ('12345678901234567890123456789012', 'sorinah.bogoescu@faculty.com', 'Sorinah Bogoescu', 1, 5),
  ('12345678901234567890123456789012', 'teodosie.sandulescu@faculty.com', 'Teodosie Sandulescu', 1, 5),
  ('12345678901234567890123456789012', 'costi.baicu@faculty.com', 'Costi Baicu', 1, 5),
  ('12345678901234567890123456789012', 'petru.rusu@faculty.com', 'Petru Rusu', 1, 5),
  ('12345678901234567890123456789012', 'olga.ceausescu@faculty.com', 'Olga Ceausescu', 1, 5),
  ('12345678901234567890123456789012', 'rodica.ilie@faculty.com', 'Rodica Ilie', 1, 5),
  ('12345678901234567890123456789012', 'augustina.pavel@faculty.com', 'Augustina Pavel', 1, 5);
  -- ('12345678901234567890123456789012', 'ionus.barladeanu@faculty.com', 'Ionus Bârladeanu', 2, 1),
  -- ('12345678901234567890123456789012', 'sorin.tomoiaga@faculty.com', 'Sorin Tomoiaga', 2, 1),
  -- ('12345678901234567890123456789012', 'cami.presecan@faculty.com', 'Cami Presecan', 2, 1),
  -- ('12345678901234567890123456789012', 'virgil.barbulescu@faculty.com', 'Virgil Barbulescu', 2, 1),
  -- ('12345678901234567890123456789012', 'ciprian.vulpes@faculty.com', 'Ciprian Vulpes', 2, 1),
  -- ('12345678901234567890123456789012', 'aurica.stefoniou@faculty.com', 'Aurica Stefoniou', 2, 1),
  -- ('12345678901234567890123456789012', 'lucian.lucescu@faculty.com', 'Lucian Lucescu', 2, 1),
  -- ('12345678901234567890123456789012', 'adi.bucsa@faculty.com', 'Adi Bucsa', 2, 1),
  -- ('12345678901234567890123456789012', 'jenica.ene@faculty.com', 'Jenica Ene', 2, 1),
  -- ('12345678901234567890123456789012', 'glad.parvulescu@faculty.com', 'Glad Pârvulescu', 2, 1),
  -- ('12345678901234567890123456789012', 'monique.vladimirescu@faculty.com', 'Monique Vladimirescu', 2, 2),
  -- ('12345678901234567890123456789012', 'velkan.dragan@faculty.com', 'Velkan Dragan', 2, 2),
  -- ('12345678901234567890123456789012', 'rodica.kogalniceaunu@faculty.com', 'Rodica Kogalniceaunu', 2, 2),
  -- ('12345678901234567890123456789012', 'iulian.pangratiu@faculty.com', 'Iulian Pangratiu', 2, 2),
  -- ('12345678901234567890123456789012', 'veronica.suciu@faculty.com', 'Veronica Suciu', 2, 2),
  -- ('12345678901234567890123456789012', 'dorina.cernea@faculty.com', 'Dorina Cernea', 2, 2),
  -- ('12345678901234567890123456789012', 'rodika.ilie@faculty.com', 'Rodika Ilie', 2, 2),
  -- ('12345678901234567890123456789012', 'sorana.gheorghe@faculty.com', 'Sorana Gheorghe', 2, 2),
  -- ('12345678901234567890123456789012', 'ionel.mihai@faculty.com', 'Ionel Mihai', 2, 2),
  -- ('12345678901234567890123456789012', 'marius.kazaku@faculty.com', 'Marius Kazaku', 2, 2),
  -- ('12345678901234567890123456789012', 'alex.butacu@faculty.com', 'Alex Butacu', 2, 3),
  -- ('12345678901234567890123456789012', 'draguta.mironescu@faculty.com', 'Draguta Mironescu', 2, 3),
  -- ('12345678901234567890123456789012', 'antoaneta.teodorescu@faculty.com', 'Antoaneta Teodorescu', 2, 3),
  -- ('12345678901234567890123456789012', 'aurelia.piturca@faculty.com', 'Aurelia Piturca', 2, 3),
  -- ('12345678901234567890123456789012', 'beatrix.hurgoi@faculty.com', 'Beatrix Hurgoi', 2, 3),
  -- ('12345678901234567890123456789012', 'estera.iagar@faculty.com', 'Estera Iagar', 2, 3),
  -- ('12345678901234567890123456789012', 'dan.nicolae@faculty.com', 'Dan Nicolae', 2, 3),
  -- ('12345678901234567890123456789012', 'augustin.mihalache@faculty.com', 'Augustin Mihalache', 2, 3),
  -- ('12345678901234567890123456789012', 'dimitry.varias@faculty.com', 'Dimitry Varias', 2, 3),
  -- ('12345678901234567890123456789012', 'ion.minea@faculty.com', 'Ion Minea', 2, 3),
  -- ('12345678901234567890123456789012', 'nicu.goian@faculty.com', 'Nicu Goian', 2, 4),
  -- ('12345678901234567890123456789012', 'cristina.bucur@faculty.com', 'Cristina Bucur', 2, 4),
  -- ('12345678901234567890123456789012', 'flori.barbu@faculty.com', 'Flori Barbu', 2, 4),
  -- ('12345678901234567890123456789012', 'ihrin.moldovan@faculty.com', 'Ihrin Moldovan', 2, 4),
  -- ('12345678901234567890123456789012', 'augustina.cantacuzino@faculty.com', 'Augustina Cantacuzino', 2, 4),
  -- ('12345678901234567890123456789012', 'stefana.giurescu@faculty.com', 'Stefana Giurescu', 2, 4),
  -- ('12345678901234567890123456789012', 'anica.dimir@faculty.com', 'Anica Dimir', 2, 4),
  -- ('12345678901234567890123456789012', 'iulien.groza@faculty.com', 'Iulien Groza', 2, 4),
  -- ('12345678901234567890123456789012', 'constansa.negoitescu@faculty.com', 'Constansa Negoitescu', 2, 4),
  -- ('12345678901234567890123456789012', 'tatiana.vulcan@faculty.com', 'Tatiana Vulcan', 2, 4),
  -- ('12345678901234567890123456789012', 'crina.banciu@faculty.com', 'Crina Banciu', 2, 5),
  -- ('12345678901234567890123456789012', 'drahoslav.noica@faculty.com', 'Drahoslav Noica', 2, 5),
  -- ('12345678901234567890123456789012', 'zana.simeonescu@faculty.com', 'Zana Simeonescu', 2, 5),
  -- ('12345678901234567890123456789012', 'cornel.rudeanu@faculty.com', 'Cornel Rudeanu', 2, 5),
  -- ('12345678901234567890123456789012', 'romanitza.stinga@faculty.com', 'Romanitza Stinga', 2, 5),
  -- ('12345678901234567890123456789012', 'anemona.martinescu@faculty.com', 'Anemona Martinescu', 2, 5),
  -- ('12345678901234567890123456789012', 'serban.ungureanu@faculty.com', 'Serban Ungureanu', 2, 5),
  -- ('12345678901234567890123456789012', 'dinu.dumitru@faculty.com', 'Dinu Dumitru', 2, 5),
  -- ('12345678901234567890123456789012', 'gheorghita.gheorghiu@faculty.com', 'Gheorghita Gheorghiu', 2, 5),
  -- ('12345678901234567890123456789012', 'nedelcu.morosanu@faculty.com', 'Nedelcu Morosanu', 2, 5);