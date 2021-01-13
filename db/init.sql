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
  join_allowed BOOLEAN,
  completion_strategy ENUM (
    'RANDOM',
    'KEEP_AVERAGE_SCORE',
    'UNIFORM_SCORE',
    'SORTED_SCORE'
  )
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

ALTER TABLE student ADD FOREIGN KEY (group_id) REFERENCES stud_group (id);

ALTER TABLE student ADD FOREIGN KEY (group_collection_id) REFERENCES group_collection (id);

ALTER TABLE group_collection ADD FOREIGN KEY (owner_id) REFERENCES user (id);

ALTER TABLE stud_group ADD FOREIGN KEY (collection_id) REFERENCES group_collection (id);

-- configuration table
INSERT INTO configuration
  (join_allowed, completion_strategy)
VALUES
  (true, 'RANDOM'); -- id 1

-- user_account table
INSERT INTO user_account
  (email, password_hash, role)
VALUES
  ('admin@faculty.com', '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935', 'admin'), -- id 1
  ('organizer@faculty.com', '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba187', 'organizer'); -- id 2

-- group_collection table | Cele 2 serii: CA si CB
INSERT INTO group_collection
  (name, starting_year, owner_id, config_id)
VALUES
  ('CA', 2021, 1, 1), -- id 1
  ('CB', 2021, 1, 1); -- id 2

-- stud_group table | Cate 5 grupe pentru fiecare serie
INSERT INTO stud_group
  (name, collection_id, max_seats, occupied_seats)
VALUES
  ('311', 1, 25, 0), -- id 1 | group 311CA
  ('312', 1, 25, 0), -- id 2 | group 312CA
  ('313', 1, 25, 0), -- id 3 | group 313CA
  ('314', 1, 25, 0), -- id 4 | group 314CA
  ('315', 1, 25, 0), -- id 5 | group 315CA
  ('311', 2, 25, 0), -- id 6 | group 311CB
  ('312', 2, 25, 0), -- id 7 | group 312CB
  ('313', 2, 25, 0), -- id 8 | group 313CB
  ('314', 2, 25, 0), -- id 9 | group 314CB
  ('315', 2, 25, 0); -- id 10 | group 315CB

-- student table | 2 serii, fiecare cu cate 5 grupe, iar fiecare grupa are 10 studenti
INSERT INTO student
  (uuid_code, email, full_name, group_collection_id, group_id)
VALUES
  ('5ibbY0WJ2O358KUeN0QB6Nf9BbZ0mGlL', 'anghel.vulcan@faculty.com', 'Anghel Vulcan', 1, 1)
  ('rYLqe4lCrGbzExorSNNHDzVnGQsvLnGx', 'octavia.albu@faculty.com', 'Octavia Albu', 1, 1)
  ('P6UrIFSDOPK4rWKRFTgPEyyJeEbEqtzu', 'iosif.pavlenco@faculty.com', 'Iosif Pavlenco', 1, 1)
  ('hP4dstlA1rmUB2SAXnldEHv4Q93s6KWd', 'nandru.mitu@faculty.com', 'Nandru Mitu', 1, 1)
  ('sz0UflzNnv5bdjGT4Vm4pRybt6gFF3xn', 'valeria.zaituc@faculty.com', 'Valeria Zaituc', 1, 1)
  ('KQgM8EpQ7uqDNzB5odmuShcW97XMZmP7', 'vali.amanar@faculty.com', 'Vali Amanar', 1, 1)
  ('DFyweNw50fGOsItcQS29pJQU8njEOJQy', 'gogu.cocis@faculty.com', 'Gogu Cocis', 1, 1)
  ('CM4cVQU5EeYIq4OyxBhm3QdMlvUBfaaB', 'adam.mihaili@faculty.com', 'Adam Mihaili', 1, 1)
  ('qlIG8rnTtk8AM4ghq1PVe6KaKoxpbqFg', 'tara.barnutiu@faculty.com', 'Tara Barnutiu', 1, 1)
  ('0BXAoZHsxaWfezcWT4AgjrmRROlYvcjA', 'mihaela.adamache@faculty.com', 'Mihaela Adamache', 1, 1)
  ('3SPv9GkiYI9jM5U4Y91QUGqJzxOJiYYO', 'flavius.jonker@faculty.com', 'Flavius Jonker', 1, 2)
  ('mMKYLk7HgVt1Yw07QpoUf0TtCO5czsck', 'octavian.moldovan@faculty.com', 'Octavian Moldovan', 1, 2)
  ('Dpg1XFnC1RcSMtwoQU1XAox3z0DPjH6r', 'toma.bogza@faculty.com', 'Toma Bogza', 1, 2)
  ('wVTPkQX5CPEgnNUbggAxkS5y4Ws1GYw4', 'costea.banica@faculty.com', 'Costea Banica', 1, 2)
  ('qsn5ExuOmKNjZvFC3YOocBarFuia8a8G', 'shaithis.catargiu@faculty.com', 'Shaithis Catargiu', 1, 2)
  ('vaMZFXzaot9TTBqLpj4C8WPcd82aMHN0', 'amelia.tilea@faculty.com', 'Amelia Tilea', 1, 2)
  ('kFesx4Pzy7wyJu9KE3EtOqUqe5fMod76', 'sergiu.musat@faculty.com', 'Sergiu Musat', 1, 2)
  ('1WZsdHk9TcZi7UAVkbZO0nSaCGzySoun', 'dorina.ciora@faculty.com', 'Dorina Ciora', 1, 2)
  ('thvuviSISppgrW6tzjIGTeZPPbJ8viz3', 'ciprian.nicolescu@faculty.com', 'Ciprian Nicolescu', 1, 2)
  ('bOKdGmcRBQg1Rw6HK0nqOR3eisJmalzy', 'anamaria.ilionescu@faculty.com', 'Anamaria Ilionescu', 1, 2)
  ('4p8aFSBx6m0iV1nbjq2vgLg0qBG0smAL', 'mihai.checiches@faculty.com', 'Mihai Checiches', 1, 3)
  ('p9JbBzPa4dy6Yu3P5HbmnK2lJFJGcRpC', 'vladimir.cosmescu@faculty.com', 'Vladimir Cosmescu', 1, 3)
  ('5vH84YA1Gf2JmWQieDZVjDQ96Y1SMXkJ', 'silviu.nica@faculty.com', 'Silviu Nica', 1, 3)
  ('Vg3PYgT4XbljZAOzqgpKThOiqWE6xRn1', 'geza.hurgoi@faculty.com', 'Geza Hurgoi', 1, 3)
  ('RUSbbmz1fYIRtZJN2uCJFjcbco9wmBmn', 'anca.korzha@faculty.com', 'Anca Korzha', 1, 3)
  ('ZzrJMfRfew0A9jaXDd4irPb6lyivQkJJ', 'laurentia.rudeanu@faculty.com', 'Laurentia Rudeanu', 1, 3)
  ('SksUhfGGx4N7cLYWl7ZolLZ6e59UHCNi', 'valerian.skutnik@faculty.com', 'Valerian Skutnik', 1, 3)
  ('eRKjtUPxviRVgde9xVJM05WGM70tb2K8', 'michaela.dalca@faculty.com', 'Michaela Dalca', 1, 3)
  ('ByikxrO5W8l24VEOnfd4qcVYjg0ZAGK9', 'ruxandra.pangratiu@faculty.com', 'Ruxandra Pangratiu', 1, 3)
  ('iLqOWdHD8GTOTTJuK2ofHo6OnuUUHnMO', 'marilena.tomoiaga@faculty.com', 'Marilena Tomoiaga', 1, 3)
  ('hS4VIzPDNDfXhZv69qpU0JSvdLrNdlxs', 'marcel.rotaru@faculty.com', 'Marcel Rotaru', 1, 4)
  ('4kUoKyXBEkYR5DDTOBKLoqaDgu5Jm2dH', 'helga.macek@faculty.com', 'Helga Macek', 1, 4)
  ('X65apy9bIQJYDcSefyNiZf3P99hyonDO', 'daniel.cornea@faculty.com', 'Daniel Cornea', 1, 4)
  ('BzqZ07no7ofq5zlgHtCPkuoTdZgkB1TN', 'laurentiu.puiu@faculty.com', 'Laurentiu Puiu', 1, 4)
  ('eKybZ9c6PhhiiVJnQP6ooe8yqW830Lvc', 'ionela.lupei@faculty.com', 'Ionela Lupei', 1, 4)
  ('2NPMrgUDUFqp6RcLD6v2tucnAzT2YmCW', 'sebastian.craciun@faculty.com', 'Sebastian Craciun', 1, 4)
  ('IjHBTC4C78OcbfgcwZF3UmswZGpa8A8P', 'mihaita.ungureanu@faculty.com', 'Mihaita Ungureanu', 1, 4)
  ('1XonbxW0sgs8X4PZTyjEzQ8WjYEnlAYd', 'ionatan.vulpes@faculty.com', 'Ionatan Vulpes', 1, 4)
  ('QKF2k94iq7MTSD6OP1Vev076FJQmyhzu', 'angela.lascar@faculty.com', 'Angela Lascar', 1, 4)
  ('VkbjvZAyJUKE2McOz3Sn628i2s6pc5cp', 'jean.rosetti@faculty.com', 'Jean Rosetti', 1, 4)
  ('Wn1WkytCDlum5Kuni5uwM18U8sr1uJ10', 'olympia.predoiu@faculty.com', 'Olympia Predoiu', 1, 5)
  ('OcMpTcdyMMEMCVprSDxm8uyWUDqAvWgK', 'marta.mihalache@faculty.com', 'Marta Mihalache', 1, 5)
  ('E0hYxv7macsDXkYxjejhCCZAq5B8bSFW', 'zana.izbasa@faculty.com', 'Zana Izbasa', 1, 5)
  ('bLxV56PQBUVcQUSiWyEIUIWHmN4QTW0U', 'sorinah.bogoescu@faculty.com', 'Sorinah Bogoescu', 1, 5)
  ('CVgtOpvhwIeujpgISUEPRfFrtthcnSCC', 'teodosie.sandulescu@faculty.com', 'Teodosie Sandulescu', 1, 5)
  ('TF170KZ0eF6Xnimp5eWQbcrJiteVXklO', 'costi.baicu@faculty.com', 'Costi Baicu', 1, 5)
  ('1Z4kTY7AFT6dsYQsu9q8ETNB7rfS9aS6', 'petru.rusu@faculty.com', 'Petru Rusu', 1, 5)
  ('nBRVwl7LjlHKcYDxH4F5N2KMXcrbg7EQ', 'olga.ceausescu@faculty.com', 'Olga Ceausescu', 1, 5)
  ('UYAbczY0pod22fRUncukNt5s2mEmXiv0', 'rodica.ilie@faculty.com', 'Rodica Ilie', 1, 5)
  ('X0dlxUUThUNmqR8Xp8rRszMaaG7BGWIN', 'augustina.pavel@faculty.com', 'Augustina Pavel', 1, 5)
  ('X3ZDlLumNTjWLykdOhqg9mt2Vh5A6KN6', 'ionus.barladeanu@faculty.com', 'Ionus Bârladeanu', 2, 1)
  ('kT1bJ3EDjLoKoUDGShlLzAIUoLu0pUdV', 'sorin.tomoiaga@faculty.com', 'Sorin Tomoiaga', 2, 1)
  ('T6FEw1Ms41HTav1isz7zloGBZQDeTQqn', 'cami.presecan@faculty.com', 'Cami Presecan', 2, 1)
  ('FSyVwknxWATfYE4pSyXTtWMBX5QJndgr', 'virgil.barbulescu@faculty.com', 'Virgil Barbulescu', 2, 1)
  ('PeaD8EytfeIGJVchRa8IPRZduiytnDEo', 'ciprian.vulpes@faculty.com', 'Ciprian Vulpes', 2, 1)
  ('WynH8DzlsCszfjRT22puE4AOgxNtcu3p', 'aurica.stefoniou@faculty.com', 'Aurica Stefoniou', 2, 1)
  ('w7KYNwqdeJKlCxORCZhHkbfNL6ZQnimf', 'lucian.lucescu@faculty.com', 'Lucian Lucescu', 2, 1)
  ('7NnEoO6CcjWWk3G2DRX5C5N4trTrbZh1', 'adi.bucsa@faculty.com', 'Adi Bucsa', 2, 1)
  ('3BAZ9yaSCRD06Kn9Bx2zHfkaNE79eEgc', 'jenica.ene@faculty.com', 'Jenica Ene', 2, 1)
  ('TIPeDqLmT6EJ5oo1poeWo57wuOO7b1lB', 'glad.parvulescu@faculty.com', 'Glad Pârvulescu', 2, 1)
  ('7n031xMF1fKKXEZG4eXKX8Emt1Hps8WG', 'monique.vladimirescu@faculty.com', 'Monique Vladimirescu', 2, 2)
  ('Z3KAREWH6UNSuLNWqIZAgpbSENDNmauR', 'velkan.dragan@faculty.com', 'Velkan Dragan', 2, 2)
  ('2CYeFqd9NMVXAGxdibJZmvfHQiCKFPqk', 'rodica.kogalniceaunu@faculty.com', 'Rodica Kogalniceaunu', 2, 2)
  ('uUORgWTSvNNT4fPctWgrhguuRQXwQ7Aj', 'iulian.pangratiu@faculty.com', 'Iulian Pangratiu', 2, 2)
  ('psQsxvsbedeJq5lfDkDfyFfsif6DqRal', 'veronica.suciu@faculty.com', 'Veronica Suciu', 2, 2)
  ('IM6aoCgmO4jHu30n6bNKTBfTGHoAnGB0', 'dorina.cernea@faculty.com', 'Dorina Cernea', 2, 2)
  ('rXSKiHnGCzfaN2qNNOylXQ9VWi6hhB6u', 'rodika.ilie@faculty.com', 'Rodika Ilie', 2, 2)
  ('TZyZtpjA8YJpsSlxmgDcfVEfCQy3kLVm', 'sorana.gheorghe@faculty.com', 'Sorana Gheorghe', 2, 2)
  ('Zwm2X71acYxOrXBExOk5NFJ1RVUqxCyc', 'ionel.mihai@faculty.com', 'Ionel Mihai', 2, 2)
  ('V8qhbBLjBwnW2KsWX3rRcvJ8XqZKgDUT', 'marius.kazaku@faculty.com', 'Marius Kazaku', 2, 2)
  ('ZjxgF31drbCLFmm4lfH74PplG0je7jxM', 'alex.butacu@faculty.com', 'Alex Butacu', 2, 3)
  ('PSuyE9n5TdBpASorltquwSEZWVKFQBGQ', 'draguta.mironescu@faculty.com', 'Draguta Mironescu', 2, 3)
  ('QKp3013BOm9Ix8X7f7ADjgkgDbLnYmhT', 'antoaneta.teodorescu@faculty.com', 'Antoaneta Teodorescu', 2, 3)
  ('Nl5LOutoW2gNV9yMhaj5v5rXY6anwQGn', 'aurelia.piturca@faculty.com', 'Aurelia Piturca', 2, 3)
  ('Wc3wV2CQO6snXVVZufpdaMRS1odRdH82', 'beatrix.hurgoi@faculty.com', 'Beatrix Hurgoi', 2, 3)
  ('7o0B0YnTftt1MXtRR8JrfmMRpUayC8SD', 'estera.iagar@faculty.com', 'Estera Iagar', 2, 3)
  ('y0zZr97WHXhPJl63qxTc9syDbrwIZDfZ', 'dan.nicolae@faculty.com', 'Dan Nicolae', 2, 3)
  ('OhiFMatLMYw9YqOkOmFTa5GpKHgWzPCg', 'augustin.mihalache@faculty.com', 'Augustin Mihalache', 2, 3)
  ('7MqX44DK5nsoZowwTRSns1g85a3GdQ7y', 'dimitry.varias@faculty.com', 'Dimitry Varias', 2, 3)
  ('Nwi0l6BEWQhERN1NWRbi4a5IwcnV4O9k', 'ion.minea@faculty.com', 'Ion Minea', 2, 3)
  ('BJEOg7PlVqursKMV9Zrw7Y3r575v3GZR', 'nicu.goian@faculty.com', 'Nicu Goian', 2, 4)
  ('VQdZryLS8szXfSjgtdNe5frnUNLSIJsi', 'cristina.bucur@faculty.com', 'Cristina Bucur', 2, 4)
  ('WMyme1IWvl8TTeKgRpJ6yh6wRfmsfqUg', 'flori.barbu@faculty.com', 'Flori Barbu', 2, 4)
  ('ikfEBsszRm0iQ0JG7vAghciLBaY3J6pQ', 'ihrin.moldovan@faculty.com', 'Ihrin Moldovan', 2, 4)
  ('9Wt34EJNLjsNVyOFsDTuJciobyULxPfY', 'augustina.cantacuzino@faculty.com', 'Augustina Cantacuzino', 2, 4)
  ('mancpZ1Kw8171YGR7ZOBlgtKhv4gncQZ', 'stefana.giurescu@faculty.com', 'Stefana Giurescu', 2, 4)
  ('3FX3nweDOsFlXIMMVodz2yZlR2hPm73t', 'anica.dimir@faculty.com', 'Anica Dimir', 2, 4)
  ('6qrYRwkKmPgVaJG1v9aWFkX3bWtfpu5e', 'iulien.groza@faculty.com', 'Iulien Groza', 2, 4)
  ('hup9xzvsGb0p7xXvnDzMb1DFtN4uOI3a', 'constansa.negoitescu@faculty.com', 'Constansa Negoitescu', 2, 4)
  ('jblRwACiaYk3pDtyLu18l28JYJCRz7BX', 'tatiana.vulcan@faculty.com', 'Tatiana Vulcan', 2, 4)
  ('5rHupVtKPusTLUq5v5VA4lAFImI1k7o4', 'crina.banciu@faculty.com', 'Crina Banciu', 2, 5)
  ('mcltYLRpd7OgCc2KwElUKbwJc4t7h2Eg', 'drahoslav.noica@faculty.com', 'Drahoslav Noica', 2, 5)
  ('AZo6Xf1WmHfbsakr0cYm3YHlvkNklPNc', 'zana.simeonescu@faculty.com', 'Zana Simeonescu', 2, 5)
  ('5h7vqTfYCPRr9QHXWCUTvuBsyft5P4Yy', 'cornel.rudeanu@faculty.com', 'Cornel Rudeanu', 2, 5)
  ('SSKa9bPzW7ix8OlKyzVYKxfFMNMPG2JE', 'romanitza.stinga@faculty.com', 'Romanitza Stinga', 2, 5)
  ('ABpSDqL0zydvKolCmicM4VFo7pkAnJYF', 'anemona.martinescu@faculty.com', 'Anemona Martinescu', 2, 5)
  ('bxZaac2KW3kn1ye50BMLdTDBfCYtE1er', 'serban.ungureanu@faculty.com', 'Serban Ungureanu', 2, 5)
  ('9YiSU6ERJfn9HuEJ3ujwo5LD1Gk3ubFJ', 'dinu.dumitru@faculty.com', 'Dinu Dumitru', 2, 5)
  ('x5729tUXDbgoKNrUqjkKaS6wzprTq33u', 'gheorghita.gheorghiu@faculty.com', 'Gheorghita Gheorghiu', 2, 5)
  ('523aKCoXhhcyZl2VIu2AAq8RvpV0DyTJ', 'nedelcu.morosanu@faculty.com', 'Nedelcu Morosanu', 2, 5)