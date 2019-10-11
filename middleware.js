const path = require("path");

function requireLoggedOutUser(req, res, next) {
    if (req.session.user) {
        res.redirect("/petition");
    } else {
        next();
    }
}

function requireSignature(req, res, next) {
    if (!req.session.user.signatureId) {
        res.redirect("/petition");
    } else {
        next();
    }
}

function requireNoSignature(req, res, next) {
    if (req.session.user.signatureId) {
        res.redirect("/thanks");
    } else {
        next();
    }
}

const preventCookieMischief = (req, res, next) => {
    res.set("x-frame-options", "deny"); // prevent site from being loaded in an iFrame
    res.locals.csrfToken = req.csrfToken(); // don't forget to add a hidden input field with token on all pages with a form
    next();
};

function requireLoggedInUser(req, res, next) {
    return !req.session.user &&
        req.url != "/register" &&
        req.url != "/login" &&
        req.url != "/cookie" &&
        path.extname(req.url) == ""
        ? res.redirect("/register")
        : next();
}

function requireCookiesAccepted(req, res, next) {
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
}

module.exports = {
    requireLoggedOutUser,
    requireNoSignature,
    requireSignature,
    requireLoggedInUser,
    preventCookieMischief,
    requireCookiesAccepted
};
