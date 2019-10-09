-- start the server:
-- "sudo service postgresql start"

-- To config the database:
-- "psql -d petition -f config.sql"

-- DELETE TABLE
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

-- CREATE TABLE
create table signatures(
    id serial primary key,
    first varchar(255) not null check (first != ''),
    last varchar(255) not null check (last != ''),
    signature text not null,
    user_id int, --Add "references users(id)" in production,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
    password VARCHAR(255) NOT NULL CHECK (password != ''),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR,
    url VARCHAR,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE
 );


-- POPULATE DATABASES
INSERT INTO signatures (first, last, signature) VALUES ('John', 'Due', 'John Due');
INSERT INTO signatures (first, last, signature) VALUES ('Sammy', 'Soe', 'Sammy Soe');
INSERT INTO signatures (first, last, signature) VALUES ('Tommy', 'Toe', 'Tommy Toe');

INSERT INTO users (first, last, email, password) VALUES ('Tommy', 'Toe', 'tommytoe@gmail.com', 'holymoly');
INSERT INTO users (first, last, email, password) VALUES ('Sammy', 'Soe', 'sammysoe@hotmail.com', 'asldkjölkjasdf');


INSERT INTO user_profiles (age, city, url, user_id) VALUES (32, 'Berlin', 'https://www.test.com', 1);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (55, 'Hamburg', NULL, 2);

SELECT * FROM signatures;
SELECT * FROM users;
SELECT * FROM user_profiles;
SELECT * FROM users JOIN user_profiles ON user_profiles.user_id = users.id;
