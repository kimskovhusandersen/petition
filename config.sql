-- start the server:
-- "sudo service postgresql start"

-- To config the database:
-- "psql -d petition -f config.sql"

-- To select database:
-- \c testdb


-- DELETE TABLE
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS geolocations;

-- CREATE TABLE
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
    password VARCHAR(255) NOT NULL CHECK (password != ''),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INT UNIQUE NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    user_id INT UNIQUE NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
 );

 CREATE TABLE geolocations(
     id SERIAL PRIMARY KEY,
     lat DECIMAL NOT NULL,
     lng DECIMAL NOT NULL,
     user_id INT UNIQUE NOT NULL REFERENCES users(id),
     created_at TIMESTAMP DEFAULT now()
 );

-- ADD RELATIONS (FOREIGN KEYS)
-- ALTER TABLE signatures ADD CONSTRAINT signatures_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- POPULATE DATABASES

INSERT INTO users (first, last, email, password) VALUES ('John', 'Due', 'johndue@gmail.com', 'bruh');
INSERT INTO users (first, last, email, password) VALUES ('Tommy', 'Toe', 'tommytoe@gmail.com', 'holymoly');
INSERT INTO users (first, last, email, password) VALUES ('Sammy', 'Soe', 'sammysoe@hotmail.com', 'asldkjölkjasdf');
INSERT INTO users (first, last, email, password) VALUES ('Sophia', 'Hutton', 'kkevo.tushe.58y@iwsi.ru', 'asdfasdf');
INSERT INTO users (first, last, email, password) VALUES ('Krishan', 'Kirk', 'oamam.haddo@ipmaximus.ru', 'wert');
INSERT INTO users (first, last, email, password) VALUES ('Darlene', 'Moss', '2d.m.x.4bfci@pendokngana.tk', '234tsf');
INSERT INTO users (first, last, email, password) VALUES ('Rhydian', 'Haas', 'jhamzato@mhdsl.gq', 'kljjKKK');
INSERT INTO users (first, last, email, password) VALUES ('Luciano', 'Combs', 'vraous.d@excel-guru.ru', 'aökljakjdkK');
INSERT INTO users (first, last, email, password) VALUES ('Hamaad', 'Fellows', 'Hamaad@Fellows.cf', '09ioilkhkjh');
INSERT INTO users (first, last, email, password) VALUES ('Paul', 'Cervantes', 'Paul@Cervantes.gq', 'kljjKKK');
INSERT INTO users (first, last, email, password) VALUES ('Cain', 'Jennings', 'Cain.d@Jennings-guru.ru', 'aökljakjdkK');
INSERT INTO users (first, last, email, password) VALUES ('Enid', 'Mcintosh', 'Enid@Mcintosh.cf', '09ioilkhkjh');

INSERT INTO signatures (signature, user_id) VALUES ('John Due', 1);
INSERT INTO signatures (signature, user_id) VALUES ('Tommy Toe', 2);
INSERT INTO signatures (signature, user_id) VALUES ('Sammy Soe', 3);
INSERT INTO signatures (signature, user_id) VALUES ('Sophia', 4);
INSERT INTO signatures (signature, user_id) VALUES ('Krishan', 5);
INSERT INTO signatures (signature, user_id) VALUES ('Darlene', 6);
INSERT INTO signatures (signature, user_id) VALUES ('Rhydian', 7);
INSERT INTO signatures (signature, user_id) VALUES ('Luciano', 8);
INSERT INTO signatures (signature, user_id) VALUES ('Hamaad', 9);
INSERT INTO signatures (signature, user_id) VALUES ('Paul', 10);
INSERT INTO signatures (signature, user_id) VALUES ('Cain', 11);
INSERT INTO signatures (signature, user_id) VALUES ('Enid', 12);


INSERT INTO user_profiles (age, city, url, user_id) VALUES (18, 'Berlin', 'https://www.test.com', 1);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (99, 'Hamburg', NULL, 2);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (32, 'Tokyo', 'https://www.test.com', 3);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (18, 'Hamburg', NULL, 4);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (57, 'Copenhagen', 'https://www.test.com', 5);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (32, 'New York', NULL, 6);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (48, 'Berlin', 'https://www.test.com', 7);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (56, 'Rostock', NULL, 8);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (78, 'Sacramento', 'https://www.test.com', 9);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (19, 'Moskva', NULL, 10);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (48, 'Helsinki', 'https://www.test.com', 11);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (68, 'Berlin', NULL, 12);


INSERT INTO geolocations (lat, lng, user_id) VALUES (52.52000659999999, 13.404954, 1);
INSERT INTO geolocations (lat, lng, user_id) VALUES (53.5511, 9.9937, 2);
INSERT INTO geolocations (lat, lng, user_id) VALUES (35.6762, 139.6503, 3);
INSERT INTO geolocations (lat, lng, user_id) VALUES (53.5511, 9.9937, 4);
INSERT INTO geolocations (lat, lng, user_id) VALUES (55.6761, 12.5683, 5);
INSERT INTO geolocations (lat, lng, user_id) VALUES (40.7128, 74.0060, 6);
INSERT INTO geolocations (lat, lng, user_id) VALUES (52.52000659999999, 13.404954, 7);
INSERT INTO geolocations (lat, lng, user_id) VALUES (54.0924, 12.0991, 8);
INSERT INTO geolocations (lat, lng, user_id) VALUES (38.5816, 121.4944, 9);
INSERT INTO geolocations (lat, lng, user_id) VALUES (55.7558, 37.6173, 10);
INSERT INTO geolocations (lat, lng, user_id) VALUES (60.1699, 24.9384, 11);
INSERT INTO geolocations (lat, lng, user_id) VALUES (52.52000659999999, 13.404954, 12);

SELECT * FROM users;
SELECT * FROM signatures;
SELECT * FROM user_profiles;
SELECT * FROM geolocations;
