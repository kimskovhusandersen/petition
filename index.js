const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const cookie = require("./cookie");
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

app.use(cookieParser());
app.use((req, res, next) => {
    if (req.url != "/cookie") {
        if (path.extname(req.url) == ".html" || !path.extname(req.url)) {
            res.cookie("requrl", req.url, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
        }
        return req.cookies.cookiesAccepted != "accepted"
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
    if (req.cookies.petitionSigned) {
        return res.redirect("signers");
    }
    res.render("petition");
});

app.post("/petition", (req, res) => {
    if (req.cookies.petitionSigned) {
        return res.redirect("signers");
    }
    const { first, last, signature } = req.body;
    db.createSignature(first, last, signature)
        .then(() => {
            return res.cookie(`petitionSigned`, "true");
        })
        .then(() => {
            res.redirect("thanks");
        })
        .catch(() => {
            res.render("petition", { error: true });
        });
});

app.get("/thanks", (req, res) => {
    db.getCountSigners()
        .then(countSigners => {
            // console.log(countSigners.rows[0].row.countSigners);
            res.render("thanks", { countSigners });
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
        res.cookie(`cookiesAccepted`, "accepted");
        res.redirect(req.cookies.requrl);
    } else {
        res.redirect("/cookie");
    }
});

app.listen(8080, console.log("I'm listening!"));
