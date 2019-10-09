const db = require("./db");
const { promisify } = require("util");
let { genSalt, hash, compare } = require("bcryptjs");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

exports.hash = password => genSalt().then(salt => hash(password, salt));

exports.auth = (email, password) => {
    return db.getHash(email).then(result => {
        if (!result.rows[0]) {
            return Promise.reject(
                new Error("Incorrect email. Please try again.")
            );
        }
        const { hash } = result.rows[0];
        return compare(password, hash);
    });
};
