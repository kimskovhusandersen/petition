const express = require("express");
const app = express();
const cookieSession = require("cookie-session");

const db = require("./db");
const path = require("path");
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
app.use((req, res, next) => {
    if (req.url != "/cookie") {
        if (path.extname(req.url) == ".html" || !path.extname(req.url)) {
            req.session.requrl = req.url;
        }
        return req.session.cookiesAccepted != "accepted"
            ? res.redirect(`/cookie`)
            : next();
    }
    next();
});

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
    res.redirect("petition");
});

app.get("/petition", (req, res) => {
    if (req.session.signatureId != null) {
        return res.redirect("signers");
    }
    res.render("petition");
});

app.post("/petition", (req, res) => {
    if (req.session.signatureId != null) {
        return res.redirect("signers");
    }
    const { first, last, signature } = req.body;

    db.createSignature(first, last, signature)
        .then(row => {
            const { id } = row.rows[0];
            req.session.signatureId = id;
        })
        .then(() => {
            res.redirect("thanks");
        })
        .catch(() => {
            res.render("petition", { error: true });
        });
});

app.get("/thanks", (req, res) => {
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
            res.render("thanks", { countSigners, signature });
        })
        .catch(err => {
            console.log(err);
            res.render("thanks", { error: true });
        });
});

app.get("/signers", (req, res) => {
    // Call db function to do query to get first and last names of signers
    // Pass the rows array you get back to the signers template
    db.getSigners()
        .then(signers => {
            res.render("signers", { signers });
        })
        .catch(err => {
            console.log(err);
            res.render("signers", { error: true });
        });
});

app.get("/cookie", (req, res) => {
    res.send(`
        <p>We respect your concerns about privacy and value the relationship that we have with you.

        Please take a moment to familiarise yourself with our cookie practices and let us know if you have any questions by sending us an <a href="javascript://">e-mail</a> or submitting a request
        through the 'Contact Us' for on our website.

        We have tried to keep this notice as simple as possible, but if you're not familiar with terms, such as cookies, then read about these <a href="javascript://">key terms</a> first.

        <form method="POST">
            <label>I Accept</label>
            <input type="checkbox" value="accepted" name="cookiesAccepted">
            <button>Continue to page</button>
        </form>
        `);
});

app.post("/cookie", (req, res) => {
    if (req.body.cookiesAccepted == "accepted") {
        req.session.cookiesAccepted = "accepted";
        res.redirect(req.session.requrl);
    } else {
        res.redirect("/cookie");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.send(`You've been logged out!`);
});

app.listen(8080, console.log("I'm listening!"));
