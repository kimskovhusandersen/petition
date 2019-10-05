
-- Before running the server, enter the followin command from then commandline:
-- psql -d petition -f config.sql

-- DELETE TABLE
DROP TABLE IF EXISTS signature;

-- CREATE TABLE
create table signature(
    id serial primary key,
    first varchar(255) not null,
    last varchar(255) not null,
    signature varchar not null
);

-- POPULATE DATABASE
insert into signature (first, last, signature) values ('John', 'Due', 'John Due');
insert into signature (first, last, signature) values ('Sammy', 'SOe', 'Sammy Soe');
insert into signature (first, last, signature) values ('Tommy', 'Toe', 'Tommy Toe');


select * from signature
