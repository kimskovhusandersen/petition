const express = require("express");
const app = (exports.app = express());
const cookieSession = require("cookie-session");
const { SESSION_SECRET: sessionSecret, api } =
    process.env.NODE_ENV == "production"
        ? process.env
        : require("./config.json");

const csurf = require("csurf");
const hb = require("express-handlebars");
// ----------------------------------------------
// Use express' build-in support of handlebars
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
const db = require("./db");
const mw = require("./middleware");
const profileRouter = require("./profile-routes");
const authRouter = require("./auth-routes");

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf()); // place after body-parsing (urlencoded) and cookieSession.

app.use(mw.preventCookieMischief);

app.use(mw.requireCookiesAccepted);

app.use(mw.requireLoggedInUser);

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
    res.redirect("/petition");
});

// AUTH ROUTES:
app.use(authRouter);
// PROFILE ROUTES
app.use("/profile", profileRouter);

app.get("/petition", mw.requireNoSignature, (req, res) => {
    const { user } = req.session;
    res.render("petition", { user });
});

app.post("/petition", mw.requireNoSignature, (req, res) => {
    const { user } = req.session;
    const { userId } = user;
    const { signature } = req.body;
    db.createSignature(signature, userId)
        .then(result => {
            const { signature_id: signatureId } = result.rows[0];
            user.signatureId = signatureId;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.render("petition", { user, error: true, err });
        });
});

app.get("/thanks", mw.requireSignature, (req, res) => {
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

app.get("/signers", mw.requireSignature, (req, res) => {
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

app.get("/signers/:city", mw.requireSignature, (req, res) => {
    const { user } = req.session;
    const { city } = req.params;
    db.getSignersByCity(city)
        .then(signers => {
            res.render("signers", { signers, user, city });
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
            res.render("profile-edit", { error: true, err });
        });
});

app.post("/geolocations", (req, res) => {
    console.log("INSIDE");
    db.getGeolocations().then(result => {
        result.rows.push(api);
        res.send(result.rows);
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
    db.deleteGeolocation(userId).catch(err => {
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

app.get("/cookie", mw.requireNoCookies, (req, res) => {
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

app.get("*", (req, res) => {
    res.redirect("/petition");
});

if (require.main === module) {
    app.listen(process.env.PORT || 8080, console.log("I'm listening!"));
}
//
