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

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
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
            console.log(user.signatureId);
            return user.signatureId === null
                ? res.redirect("/petition")
                : res.redirect("/signers");
        })
        .catch(err => {
            console.log(err);
            res.render("login", { error: true, err });
        });
});

app.get("/logout", (req, res) => {
    delete req.session.user;
    res.render("logout");
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
            const { user_id: userId, first, last, email } = result.rows[0];
            req.session.user = { userId, first, last, email };
            res.redirect("/profile");
        })
        .catch(err => {
            console.log(err);
            res.render("register", { error: true });
        });
});

app.get("/profile", (req, res) => {
    const { user } = req.session;
    res.render("profile", { user });
});

app.post("/profile", (req, res) => {
    const { age, city, url } = req.body;
    const { userId } = req.session.user;
    db.upsertUserProfiles(age, city, url, userId)
        .then(result => {
            const { age, city, url } = result.rows[0];
            req.session.user = { ...req.session.user, age, city, url };
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/petition");
        });
});

app.get("/profile/edit", (req, res) => {
    const { user } = req.session;
    db.getSignature(user.signatureId)
        .then(result => {
            const { signature } = result.rows[0];
            res.render("profile-edit", { user, signature });
        })
        .catch(err => {
            console.log(err);
            res.render("profile-edit", { user });
        });
});

app.post("/profile/edit", (req, res) => {
    const { user } = req.session;
    const { userId } = req.session.user;
    const { first, last, email, password, age, city, url } = req.body;
    Promise.all([
        db.updateUser(first, last, email, password, userId).then(result => {
            return result.rows[0];
        }),
        db.upsertUserProfiles(age, city, url, userId).then(result => {
            return result.rows[0];
        })
    ])
        .then(result => {
            result = { ...result[0], ...result[1] };
            Object.entries(result).forEach(
                ([key, value]) => (user[`${key}`] = `${value}`)
            );

            return res.redirect("/profile/edit");
        })
        .catch(err => {
            console.log(err);
            return res.render("/profile/edit", { error: true });
        });
});

app.get("/petition", (req, res) => {
    if (req.session.user.signatureId != null) {
        return res.redirect("signers");
    }
    const { user } = req.session;
    res.render("petition", { user });
});

app.post("/petition", (req, res) => {
    if (req.session.user.signatureId != null) {
        return res.redirect("signers");
    }

    const { user } = req.session;
    const { signature } = req.body;
    const { userId } = req.session.user;
    db.createSignature(signature, userId)
        .then(result => {
            const { signature_id: signatureId } = result.rows[0];
            req.session.user.signatureId = signatureId;
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
    const { signatureId } = user;
    Promise.all([
        db.getCountSigners().then(row => {
            return row.rows[0].countsigners;
        }),
        db.getSignature(signatureId).then(row => {
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

app.get("/signers/:city", (req, res) => {
    const { user } = req.session;
    const { city } = req.params;
    db.getSignersByCity(city)
        .then(signers => {
            res.render("signers", { signers, user });
        })
        .catch(err => {
            console.log(err);
            res.render("signers", { error: true });
        });
});

app.post("/signature/delete", (req, res) => {
    const { user } = req.session;
    const { signatureId } = user;
    db.deleteSignature(signatureId)
        .then(() => {
            delete user.signatureId;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("/profile/edit", { error: true, err });
        });
});

app.post("/user/delete", (req, res) => {
    const { user } = req.session;
    const { userId, signatureId } = user;
    db.deleteSignature(signatureId)
        .then(() => {
            delete user.signatureId;
        })
        .catch(err => {
            console.log(err);
        });
    db.deleteUserProfile(userId)
        .then(() => {
            delete user.age;
            delete user.city;
            delete user.url;
        })
        .catch(err => {
            console.log(err);
        });
    db.deleteUser(userId)
        .then(() => {
            delete req.session.user;
            res.redirect("/register");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/profile/edit");
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

app.listen(process.env.PORT || 8080, console.log("I'm listening!"));

//
