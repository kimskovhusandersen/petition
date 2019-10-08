const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const path = require("path");
const bcrypt = require("./bcrypt");
// ----------------------------------------------
// Use express' build-in support of handlebars
const hb = require("express-handlebars");
app.engine(
    "handlebars",
    hb({
        helpers: {
            if_eq: (a, b, opts) => {
                if (a == b) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            }
        }
    })
);
app.set("view engine", "handlebars");
// ----------------------------------------------

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `Super spicy spice`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf()); // place after body-parsing (urlencoded) and cookieSession.

app.use((req, res, next) => {
    res.set("x-frame-options", "deny"); // prevent site from being loaded in an iFrame
    res.locals.csrfToken = req.csrfToken(); // don't forget to add a hidden input field with token on all pages with a form
    next();
});

app.use((req, res, next) => {
    if (req.url != "/cookie") {
        if (path.extname(req.url) == ".html" || !path.extname(req.url)) {
            req.session.requrl = req.url;
        }
        return req.session.cookiesAccepted != "accepted" &&
            path.extname(req.url) == ""
            ? res.redirect(`/cookie`)
            : next();
    }
    next();
});

app.use((req, res, next) => {
    req.url == "/cookie" ||
    req.url == "/login" ||
    req.url == "/register" ||
    path.extname(req.url) !== ""
        ? next()
        : req.session.user === undefined || req.session.user === null
            ? res.redirect("/register")
            : next();
});

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
    res.redirect("petition");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    bcrypt
        .hash(password)
        .then(password => {
            return db.registerUser(first, last, email, password);
        })
        .then(result => {
            const { id, first, last, email } = result.rows[0];
            req.session.user = { id, first, last, email };
            console.log(req.session.user);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("register", { error: true });
        });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    bcrypt
        .auth(email, password)
        .then(auth => {
            console.log("IS USER AUTHORIZED?", auth);
            if (auth) {
                return db.getUser(email);
            }
        })
        .then(result => {
            const { id, first, last, email } = result.rows[0];
            req.session.user = { id, first, last, email };
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("login", { error: true });
        });
});

app.get("/logout", (req, res) => {
    delete req.session.user;
    res.render("logout");
});

app.get("/petition", (req, res) => {
    if (req.session.signatureId != null) {
        return res.redirect("signers");
    }
    const { user } = req.session;
    res.render("petition", { user });
});

app.post("/petition", (req, res) => {
    if (req.session.signatureId != null) {
        return res.redirect("signers");
    }

    const { user } = req.session;
    const { signature } = req.body;
    const { first, last } = req.session.user;
    db.createSignature(first, last, signature)
        .then(result => {
            const { id } = result.rows[0];
            req.session.signatureId = id;
        })
        .then(() => {
            res.redirect("thanks");
        })
        .catch(() => {
            res.render("petition", { user, error: true });
        });
});

app.get("/thanks", (req, res) => {
    const { user } = req.session;
    Promise.all([
        db.getCountSigners().then(row => {
            return row.rows[0].countsigners;
        }),
        db.getSignature(req.session.signatureId).then(row => {
            return row.rows[0].signature;
        })
    ])
        .then(data => {
            const [countSigners, signature] = data;
            res.render("thanks", { countSigners, signature, user });
        })
        .catch(err => {
            console.log(err);
            res.render("thanks", { error: true });
        });
});

app.get("/signers", (req, res) => {
    // Call db function to do query to get first and last names of signers
    // Pass the rows array you get back to the signers template

    const { user } = req.session;
    db.getSigners()
        .then(signers => {
            res.render("signers", { signers, user });
        })
        .catch(err => {
            console.log(err);
            res.render("signers", { error: true });
        });
});

app.get("/cookie", (req, res) => {
    res.render("cookie");
});

app.post("/cookie", (req, res) => {
    if (req.body.acceptCookies == "true") {
        req.session.cookiesAccepted = "accepted";
        res.redirect(req.session.requrl);
    } else {
        res.redirect("/cookie");
    }
});

app.listen(8080, console.log("I'm listening!"));
