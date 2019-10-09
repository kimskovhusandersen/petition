const spicedPg = require("spiced-pg");
// ------------------------------------------------------------------------
// FOR HEROKU:
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { username, password } = require("./config.json");
    db = spicedPg(`postgres://${username}:${password}@localhost:5432/petition`);
}
// ------------------------------------------------------------------------

module.exports.registerUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id AS user_id, first AS first, last AS last, email AS email;`,
        [first, last, email, password]
    );
};

module.exports.createSignature = (signature, userId) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id as signature_id;`,
        [signature, userId]
    );
};

exports.createUserProfiles = (age, city, url, userId) => {
    url = filterUrl(url);
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4)
        RETURNING age AS age, city AS city, url AS url, user_id AS user_id;`,
        [age, city, url, userId]
    );
};

exports.getHash = email => {
    return db.query(`SELECT password AS hash FROM users WHERE email = $1;`, [
        email
    ]);
};

module.exports.getUser = email => {
    return db.query(
        `SELECT users.id AS userId, first AS first, last AS last, email AS email, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            LEFT JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE email = $1;`,
        [email]
    );
};

module.exports.getSigners = () => {
    return db.query(
        `SELECT users.id AS userId, first AS first, last AS last, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.id = signatures.user_id;`
    );
};

module.exports.getSignersByCity = city => {
    return db.query(
        `SELECT users.id AS userId, first AS first, last AS last, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.id = signatures.user_id AND city ILIKE $1;`,
        [city]
    );
};

module.exports.getCountSigners = () => {
    return db.query(`SELECT count(*) AS countSigners FROM signatures;`);
};

module.exports.hasUserSigned = user_id => {
    return db.query(
        "SELECT count(user_id) AS hasUserSigned FROM signatures WHERE user_id = $1",
        [user_id]
    );
};
module.exports.getSignature = signatureId => {
    if (!signatureId) {
        return new Promise((resolve, reject) => {
            reject(new Error("Can't get signature without ID"));
        });
    }
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
        signatureId
    ]);
};

const filterUrl = url => {
    return url.search(/https|http|\/\//i) === 0 ? url : null;
};
