"use strict";

var User = require('../models/User'),
    config = require('../config'),
    strings = require('../strings'),
    response = require('../Utils/response'),
    jwt = require('jsonwebtoken');

module.exports = {
    // Show all users
    show: function(req, res, next) {
        User.find({}, 'email', function(err, users) {
            if (err) {
                return response.error(res, 500, strings.unexpectedBehaviour);
            }
            res.json(users);
        });
    },
    // Create a new user
    new: function(req, res, next) {
        // Check if users mandatory fields are existing
        if (req.body.email && req.body.password) {
            var newUser = User({
                email: req.body.email,
                password: req.body.password
            });
            newUser.save(function(err) {
                if (err) {
                    // Error code when there is a duplicate key, in this case : the email (unique field)
                    if (err.code === 11000) {
                        return response.error(res, 409, strings.userExists);
                    } else if (err.name === "InvalidEmail") {
                        return response.error(res, 400, strings.invalidEmail);
                    } else {
                        return response.error(res, 500, strings.unexpectedBehaviour);
                    }
                }
                response.success(res, strings.userSaved);
            });
        } else {
            // Mandatory fields are missing or not found
            response.error(res, 400, strings.missingParameters);
        }
    },
    // Update an user by email (unique field)
    update: function(req, res, next) {
        // Check if users mandatory fields are existing
        if (req.params.id) {
            if (req.decoded.admin || (req.params.id === req.decoded.id)) {
                User.findOne({ _id: req.params.id }, function(err, user) {
                    if (!user) {
                        return response.error(res, 404, strings.userNotFound);
                    } else {
                        if (req.body.email) { user.email = req.body.email; }
                        if (req.body.name) { user.name = req.body.name };
                        if (req.body.password) { user.password = req.body.password };
                        user.save(function(err) {
                            if (err) {
                                // Error code when there is a duplicate key, in this case : the email (unique field)
                                if (err.code === 11000) {
                                    return response.error(res, 409, strings.userEmailExists);
                                }
                                return response.error(res, 500, strings.unexpectedBehaviour);
                            }
                            response.success(res, strings.userUpdated);
                        });
                    }
                });
            } else {
                response.error(res, 401, strings.unauthorized);
            }
        } else {
            response.error(res, 400, strings.missingParameters);
        }
    },
    // Remove an user by email (unique field)
    delete: function(req, res, next) {
        // Check if users mandatory fields are existing
        if (req.params.id) {
            if (req.decoded.admin || (req.params.id === req.decoded.id)) {
                User.findOneAndRemove(req.params.id, function(err) {
                    if (err) {
                        return response.error(res, 500, strings.unexpectedBehaviour);
                    }
                    response.success(res, strings.userRemoved);
                });
            } else {
                response.error(res, 401, strings.unauthorized);
            }
        } else {
            response.error(res, 400, strings.missingParameters);
        }
    },
    // Authenticate the user
    authenticate: function(req, res, next) {
        if (req.body.email && req.body.password) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                    return response.error(res, 500, strings.unexpectedBehaviour);
                }
                if (!user) {
                    return response.error(res, 404, strings.userAuthNotFound);
                }
                // check if password matches
                if (user.comparePassword(req.body.password)) {
                    // create a token
                    var token = jwt.sign({
                        'email': user.email,
                        'id': user.id,
                        'admin': user.admin,
                    }, config.secret, {
                        expiresIn: config.expiresIn
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: strings.userAuthentified,
                        token: token
                    });
                } else {
                    response.error(res, 401, strings.unauthorized);
                }
            });
        } else {
            response.error(res, 400, strings.missingParameters);
        }
    }
}
