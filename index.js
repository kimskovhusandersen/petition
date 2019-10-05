const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
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

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
    res.render("petition");
});

app.post("/petition", (req, res) => {
    const { first, last, signature } = req.body;
    db.createSignature(first, last, signature)
        .then(success => {
            console.log(success);
            return db.getCountSigners();
        })
        .then(countSigners => {
            // console.log((countSigners.rows[0].row.countSigners = 1));
            res.render("thanks", { countSigners });
        })
        .catch(err => {
            console.log(err);
            res.render("petition", { error: true });
        });
});

app.get("/thanks", (req, res) => {
    db.getCountSigners()
        .then(countSigners => {
            // console.log((countSigners.rows[0].row.countSigners = 1));
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

app.listen(8080, console.log("I'm listening!"));
