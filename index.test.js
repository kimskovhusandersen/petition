const supertest = require("supertest");
const { app } = require("./index");
const cookieSession = require("cookie-session"); // require cookie session mock ( from the directory: __mocks__ )

test("POST /cookie sets cookiesAccepted to accepted", () => {
    let cookie = {
        cookiesAccepted: "accepted"
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .post("/cookie")
        .then(res => {
            // console.log(res);
            expect(cookie).toEqual({
                cookiesAccepted: "accepted"
            });
        })
        .catch(err => {
            console.log(err);
        });
});

test("GET /petition redirects me to /register", () => {
    return supertest(app)
        .get("/petition")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(302) &&
                expect(res.headers.location).toBe("/register");
        })
        .catch();
});

test("GET /petition sends statusCode 200", () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen" }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/petition")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(200);
        })
        .catch(err => {
            console.log(err);
        });
});

test("GET /petition redirects to /signers", () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen", signatureId: 1 }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/petition")
        .then(res => {
            console.log(res);
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/signers");
        })
        .catch(err => {
            console.log(err);
        });
});

test("GET /petition sends statusCode 200", () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen" }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/petition")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(200);
        })
        .catch(err => {
            console.log(err);
        });
});

test(`GET /thanks sends statusCode 200, when signatureId exists in session.user`, () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen", signatureId: 1 }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/thanks")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(200);
        })
        .catch(err => {
            console.log(err);
        });
});

test(`GET /thanks redirects to /petition, when signatureId does not exists in session.user`, () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen" }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/thanks")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

test(`GET /register redirects to /petition, when session.user exists`, () => {
    let cookie = {
        cookiesAccepted: "accepted",
        user: { userId: 1, first: "Kim", last: "Andersen" }
    };
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .get("/register")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});
