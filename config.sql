-- start the server:
-- "sudo service postgresql start"

-- To config the database:
-- "psql -d petition -f config.sql"

-- To select database:
-- \c testdb


-- DELETE TABLE
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;

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
    user_id INT, --Add "references users(id)" in production,
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age VARCHAR,
    city VARCHAR,
    url VARCHAR,
    user_id INT NOT NULL UNIQUE, -- REFERENCES users(id)
    created_at TIMESTAMP DEFAULT now()
 );


-- POPULATE DATABASES

INSERT INTO users (first, last, email, password) VALUES ('John', 'Due', 'johndue@gmail.com', 'bruh');
INSERT INTO users (first, last, email, password) VALUES ('Tommy', 'Toe', 'tommytoe@gmail.com', 'holymoly');
INSERT INTO users (first, last, email, password) VALUES ('Sammy', 'Soe', 'sammysoe@hotmail.com', 'asldkjölkjasdf');

INSERT INTO signatures (signature, user_id) VALUES ('John Due', 1);
-- INSERT INTO signatures (signature, user_id) VALUES ('Tommy Toe', 2);
INSERT INTO signatures (signature, user_id) VALUES ('Sammy Soe', 3);

INSERT INTO user_profiles (age, city, url, user_id) VALUES (32, 'Berlin', 'https://www.test.com', 1);
INSERT INTO user_profiles (age, city, url, user_id) VALUES (55, 'Hamburg', NULL, 2);

SELECT * FROM users;
SELECT * FROM signatures;
SELECT * FROM user_profiles;
