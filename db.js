const spicedPg = require("spiced-pg");
const config = require("./config.json");
const db = spicedPg(
    `postgres://${config.username}:${config.password}@localhost:5432/petition`
);

module.exports.createSignature = (first, last, signature) => {
    return db.query(
        `insert into signature (first, last, signature) values ($1, $2, $3);`,
        [first, last, signature]
    );
};

module.exports.getSigners = () => {
    return db.query(`select first as first, last as last from signature;`);
};

module.exports.getCountSigners = () => {
    return db.query(`select count(*) as countSigners from signature;`);
};
