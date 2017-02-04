"use strict";

var jwt = require('jsonwebtoken'),
    config = require('../config/config'),
    strings = require('../config/strings');

module.exports = function(options) {
    if (!options || !options.secret) {
        throw new Error('Authenticate : secret should be set.');
    }
    return (function(req, res, next) {
        // Check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // Decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, options.secret, function(err, decoded) {
                if (err) {
                    if (err.name === "JsonWebTokenError") {
                        return res.status(401).send({
                            success: false,
                            message: strings[config.language].tokenAuthFailed
                        });
                    } else if (err.name === "TokenExpiredError") {
                        return res.status(401).send({
                            success: false,
                            message: strings[config.language].tokenExpired
                        });
                    }
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            return res.status(401).json({
                success: false,
                message: strings[config.language].tokenNotFound
            });
        }
    });
};
