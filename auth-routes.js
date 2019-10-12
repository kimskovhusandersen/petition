const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("./bcrypt");
const mw = require("./middleware");

router.get("/login", mw.requireLoggedOutUser, (req, res) => {
    res.render("login");
});

router.post("/login", mw.requireLoggedOutUser, (req, res) => {
    const { email, password } = req.body;
    bcrypt
        .auth(email, password)
        .then(auth => {
            return !auth
                ? Promise.reject(
                    new Error("Incorrect password! Please try again later.")
                )
                : db.getUser(email);
        })
        .then(result => {
            const {
                user_id: userId,
                first,
                last,
                email,
                age,
                city,
                url,
                signature_id: signatureId
            } = result.rows[0];

            req.session.user = {
                userId,
                first,
                last,
                email,
                age,
                city,
                url,
                signatureId
            };
            const { user } = req.session;
            return user.signatureId === null
                ? res.redirect("/petition")
                : res.redirect("/signers");
        })
        .catch(err => {
            console.log(err);
            res.render("login", { error: true, err });
        });
});

router.get("/register", mw.requireLoggedOutUser, (req, res) => {
    res.render("register");
});

router.post("/register", mw.requireLoggedOutUser, (req, res) => {
    const { first, last, email, password } = req.body;
    bcrypt
        .hash(password)
        .then(password => {
            return db.registerUser(first, last, email, password);
        })
        .then(result => {
            const { user_id: userId, first, last, email } = result.rows[0];
            req.session.user = { userId, first, last, email };
            res.redirect("/profile");
        })
        .catch(err => {
            console.log(err);
            res.render("register", { error: true });
        });
});

router.get("/logout", (req, res) => {
    delete req.session.user;
    res.redirect("/petition");
});

module.exports = router;
