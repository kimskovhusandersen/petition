const https = require("https");
const { api } =
    process.env.NODE_ENV == "production"
        ? process.env
        : require("./config.json");

// This function gets the bearertoken from twitter
module.exports.getGeocode = city => {
    return new Promise((resolve, reject) => {
        const options = {
            host: "maps.googleapis.com",
            path: `/maps/api/geocode/json?address=${city}&key=${api}`,
            method: "GET"
        };
        const cb = function(response) {
            if (response.statusCode != 200) {
                // Call the callback function and parse the statusCode as value for "err"
                reject(response.statusCode);
                return;
            }

            let body = "";
            response.on("data", function(chunk) {
                body += chunk;
            });

            response.on("end", function() {
                let parsedBody = JSON.parse(body);
                resolve(parsedBody);
            });
        };
        const req = https.request(options, cb);
        req.end("grant_type=client_credentials");
    });
};
