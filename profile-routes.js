const express = require("express");
const router = express.Router();
const maps = require("./maps");
const db = require("./db");

router.get("/", (req, res) => {
    const { user } = req.session;
    res.render("profile", { user });
});

router.post("/", (req, res) => {
    const { age, city, url } = req.body;
    const { userId } = req.session.user;
    db.upsertUserProfiles(age, city, url, userId)
        .then(result => {
            let { age, city, url } = result.rows[0];
            city = city == null ? "" : city;
            req.session.user = { ...req.session.user, age, city, url };
            return city;
        })
        .then(city => {
            if (city != undefined && city !== "") {
                maps.getGeocode(city)
                    .then(location => {
                        return location.results[0].geometry.location;
                    })
                    .then(location => {
                        const { lat, lng } = location;
                        db.upsertGeolocations(lat, lng, userId).then(() => {
                            res.redirect("/profile/edit");
                        });
                    });
            } else {
                return res.redirect("/profile/edit");
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect("/petition");
        });
});

router.get("/edit", (req, res) => {
    const { user } = req.session;
    if (user.signatureId) {
        db.getSignature(user.signatureId)
            .then(result => {
                const { signature } = result.rows[0];
                return res.render("profile-edit", { user, signature });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.render("profile-edit", { user });
    }
});

router.post("/edit", (req, res) => {
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
            Object.entries(result).forEach(([key, value]) => {
                key = key == "user_id" ? "userId" : key;
                return (user[`${key}`] = value !== null ? `${value}` : "");
            });
            return user.city;
        })
        .then(city => {
            if (city != undefined && city !== "") {
                return maps
                    .getGeocode(city)
                    .then(location => {
                        return location.results[0].geometry.location;
                    })
                    .then(location => {
                        const { lat, lng } = location;
                        db.upsertGeolocations(lat, lng, userId).then(() => {
                            res.redirect("/profile/edit");
                        });
                    });
            } else {
                return db.deleteGeolocation(userId).then(() => {
                    return res.redirect("/profile/edit");
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.redirect("/profile/edit");
        });
});

module.exports = router;
