"use strict";

var User = require('mongoose').model('User'),
    config = require('../config/config'),
    strings = require('../config/strings'),
    response = require('../utils/response'),
    jwt = require('jsonwebtoken');

// Find an user by Id
function getUserById(req, res, _id, next) {
    User.findOne({ _id: _id }, function(err, user) {
        // In case of error or no users
        if (err || !user) {
            return response.error(res, 404, strings[config.language].userNotFound);
        } else {
            // Save in request the user
            req.user = user;
            // Callback for success
            next();
        }
    });
}

// Check if user is allowed to access to this route : only himself or admin can validate through this function
function checkOnlyUserAllowed(req, res, next) {
    if (!req.decoded.admin && (req.params._id !== req.decoded.id)) {
        return response.error(res, 403, strings[config.language].forbidden);
    }
    next();
}

module.exports = {
    showAll: function(req, res) {
        // No security here to restrict access
        User.find({}, "email name", function(err, users) {
            if (err) {
                return response.error(res, 500, strings[config.language].unexpectedBehavior);
            }
            if (users.length === 0) {
                return response.error(res, 404, strings[config.language].userShowAllNotFound);
            }
            res.json(users);
        });
    },
    // Show an user by ID
    show: function(req, res) {
        getUserById(req, res, req.params._id, function() {
            // In case of success
            res.json(req.user);
        });
    },
    // Create a new user
    new: function(req, res) {
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
                        return response.error(res, 409, strings[config.language].userExists);
                    } else if (err.name === "InvalidEmail") {
                        return response.error(res, 400, strings[config.language].invalidEmail);
                    } else {
                        return response.error(res, 500, strings[config.language].unexpectedBehavior);
                    }
                }
                response.success(res, strings[config.language].userSaved);
            });
        } else {
            // Mandatory fields are missing or not found
            response.error(res, 400, strings[config.language].missingParameters);
        }
    },
    // Update an user by email (unique field)
    update: function(req, res) {
        checkOnlyUserAllowed(req, res, function() {
            getUserById(req, res, req.params._id, function() {
                // In case of success
                // Fields allowed for update
                if (req.body.email) {
                    req.user.email = req.body.email;
                }
                if (req.body.name) {
                    req.user.name = req.body.name;
                }
                if (req.body.password) {
                    req.user.password = req.body.password;
                }
                req.user.save(function(err) {
                    if (err) {
                        // Error code when there is a duplicate key, in this case : the email (unique field)
                        if (err.code === 11000) {
                            return response.error(res, 409, strings[config.language].userEmailExists);
                        }
                        return response.error(res, 500, strings[config.language].unexpectedBehavior);
                    }
                    response.success(res, strings[config.language].userUpdated);
                });
            });
        });
    },
    // Remove an user by email (unique field)
    delete: function(req, res) {
        checkOnlyUserAllowed(req, res, function() {
            getUserById(req, res, req.params._id, function() {
                // In case of success
                req.user.remove({}, function(err) {
                    if (err) {
                        return response.error(res, 500, strings[config.language].unexpectedBehavior);
                    }
                    response.success(res, strings[config.language].userRemoved);
                });
            });
        });
    },
    // Authenticate the user
    authenticate: function(req, res) {
        if (req.body.email && req.body.password) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                    return response.error(res, 500, strings[config.language].unexpectedBehavior);
                }
                if (!user) {
                    return response.error(res, 404, strings[config.language].userAuthNotFound);
                }
                // check if password matches
                if (user.comparePassword(req.body.password)) {
                    // create a token
                    var token = jwt.sign({
                        'email': user.email,
                        'id': user.id,
                        'admin': user.admin
                    }, config.secret, {
                        expiresIn: config.expiresIn
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: strings[config.language].userAuthentified,
                        token: token
                    });
                } else {
                    response.error(res, 401, strings[config.language].userAuthFailed);
                }
            });
        } else {
            response.error(res, 400, strings[config.language].missingParameters);
        }
    }
};
