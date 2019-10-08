-- start the server:
-- "sudo service postgresql start"

-- To config the database:
-- "psql -d petition -f config.sql"

-- DELETE TABLE
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

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



-- POPULATE DATABASES
INSERT INTO signatures (first, last, signature) VALUES ('John', 'Due', 'John Due');
INSERT INTO signatures (first, last, signature) VALUES ('Sammy', 'SOe', 'Sammy Soe');
INSERT INTO signatures (first, last, signature) VALUES ('Tommy', 'Toe', 'Tommy Toe');

INSERT INTO users (first, last, email, password) VALUES ('Tommy', 'Toe', 'tommytoe@gmail.com', 'holymoly');


SELECT * FROM signatures;
SELECT * FROM users;
