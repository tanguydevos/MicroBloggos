"use strict";

var User = require('../models/User'),
    config = require('../config'),
    jwt = require('jsonwebtoken');

module.exports = {
    // Show all users
    show: function(req, res, next) {
        User.find({}, 'email', function(err, users) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Server error, unexpected behaviour."
                });
            } else {
                res.json(users);
            }
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
                        res.status(409).json({
                            success: false,
                            message: "User already exists."
                        });
                    } else if (err.message === "Invalid email.") {
                        res.status(400).json({
                            success: false,
                            message: err.message
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: "Server error, unexpected behaviour."
                        });
                    }
                } else {
                    res.json({
                        success: true,
                        message: "User saved successfully."
                    });
                }
            });
        }
        // Mandatory fields are missing or not found
        else {
            res.status(400).json({
                success: false,
                message: "Wrong or missing arguments, sorry :)"
            });
        }
    },
    // Remove an user by email (unique field)
    delete: function(req, res, next) {
        // Check if users mandatory fields are existing
        if (req.params.email) {
            User.findOneAndRemove(req.params.email, function(err) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: "Server error, unexpected behaviour."
                    });
                } else {
                    res.json({
                        success: true,
                        message: "User removed successfully."
                    });
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Wrong or missing arguments, sorry :)"
            });
        }
    },
    // Authenticate the user
    authenticate: function(req, res, next) {
        if (req.body.email && req.body.password) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: "Server error, unexpected behaviour."
                    });
                } else {
                    if (!user) {
                        res.status(404).json({
                            success: false,
                            message: 'Authentication failed. User not found.'
                        });
                    } else {
                        // check if password matches
                        if (user.comparePassword(req.body.password)) {
                            // create a token
                            var token = jwt.sign({
                                'email': user.email,
                                'id': user.id,
                                'admin': user.admin,
                            }, config.secret, {
                                expiresIn: '24h'
                            });
                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token
                            });
                        } else {
                            res.status(401).json({
                                success: false,
                                message: 'Unauthorized.'
                            });
                        }
                    }
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Wrong or missing arguments, sorry :)"
            });
        }
    }
}
