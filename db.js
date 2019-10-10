const spicedPg = require("spiced-pg");
const bcrypt = require("./bcrypt");
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

exports.getUser = email => {
    return db.query(
        `SELECT users.id AS user_id, first AS first, last AS last, email AS email, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            LEFT JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE email = $1;`,
        [email]
    );
};

exports.getSigners = () => {
    return db.query(
        `SELECT users.id AS userId, first AS first, last AS last, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.id = signatures.user_id;`
    );
};

exports.getSignersByCity = city => {
    return db.query(
        `SELECT users.id AS userId, first AS first, last AS last, age AS age, city AS city, url AS url, signatures.id AS signature_id
        FROM users
            JOIN signatures ON signatures.user_id = users.id
            LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE users.id = signatures.user_id AND city ILIKE $1;`,
        [city]
    );
};

exports.getCountSigners = () => {
    return db.query(`SELECT count(*) AS countSigners FROM signatures;`);
};

exports.getSignature = signatureId => {
    return !signatureId
        ? Promise.reject(
            new Error("Can't get signature without a signature ID")
        )
        : db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
            signatureId
        ]);
};

module.exports.updateUser = (first, last, email, password, user_id) => {
    return handlePassword(password).then(password => {
        return db
            .query(
                `UPDATE users
        SET first = $1, last = $2, email = $3, password = COALESCE($4, password)
        WHERE id = $5
        RETURNING id AS user_id, first AS first, last AS last, email AS email;`,
                [first, last, email, password, user_id]
            )
            .catch(err => {
                console.log(err);
                return Promise.reject(new Error("Can't update user"));
            });
    });
};
exports.upsertUserProfiles = (age, city, url, userId) => {
    url = filterUrl(url);
    return db
        .query(
            `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO
        UPDATE SET age = $1, city = $2, url = $3, user_id = $4
        RETURNING age AS age, city AS city, url AS url, user_id AS user_id;`,
            [age, city, url, userId]
        )
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't upsert user profiles"));
        });
};

exports.deleteSignature = signatureId => {
    return db
        .query(`DELETE FROM signatures WHERE id = $1;`, [signatureId])
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't delete signature"));
        });
};

exports.deleteUserProfile = userId => {
    return db
        .query(`DELETE FROM user_profiles WHERE user_id = $1;`, [userId])
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't delete user profile"));
        });
};

exports.deleteUser = userId => {
    return db.query(`DELETE FROM users WHERE id = $1;`, [userId]).catch(err => {
        console.log(err);
        return Promise.reject(new Error("Can't delete user"));
    });
};

const filterUrl = url => {
    return url.search(/https|http|\/\//i) === 0 ? url : null;
};

const handlePassword = password => {
    return password == ""
        ? new Promise((resolve, reject) => {
            resolve(null);
        })
        : bcrypt.hash(password).then(hash => hash);
};
