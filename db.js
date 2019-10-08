const spicedPg = require("spiced-pg");
const config = require("./config.json");
const db = spicedPg(
    `postgres://${config.username}:${config.password}@localhost:5432/petition`
);

module.exports.registerUser = (first, last, email, password) => {
    console.log("INSIDE DB", first, last, email, password);
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id AS id, first AS first, last AS last, email AS email;`,
        [first, last, email, password]
    );
};

exports.getHash = email => {
    return db.query(`SELECT password AS hash FROM users WHERE email = $1;`, [
        email
    ]);
};

module.exports.getUser = email => {
    return db.query(
        `SELECT id AS id, first AS first, last AS last, email AS email FROM users WHERE email = $1;`,
        [email]
    );
};

module.exports.createSignature = (first, last, signature) => {
    return db.query(
        `INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id;`,
        [first, last, signature]
    );
};

module.exports.getSigners = () => {
    return db.query(`SELECT first AS first, last AS last FROM signatures;`);
};

module.exports.getCountSigners = () => {
    return db.query(`SELECT count(*) AS countSigners FROM signatures;`);
};

module.exports.hasUserSigned = user_id => {
    return db.query("SELECT user_id FROM signatures WHERE user_id = $1", [
        user_id
    ]);
};
module.exports.getSignature = id => {
    if (!id) {
        return new Promise((resolve, reject) => {
            reject(new Error("Can't get signature without ID"));
        });
    }
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [id]);
};
