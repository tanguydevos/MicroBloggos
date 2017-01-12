"use strict";

var User = require('../models/User');

module.exports = {
  show: function(req, res, next) {
    User.find({}, function (err, users) {
      if (err) {
        res.status(500).json({
          success: false,
          message : "Server error, unexpected behaviour."
        });
      } else {
        res.status(200).json(users);
      }
    });
  },
  new: function(req, res, next) {
    // Check if users mandatory fields are existing
    if (req.body.email && req.body.password) {
      var newUser = User({
        email : req.body.email,
        password: req.body.password
      });
      newUser.save(function (err) {
        if (err) {
          // Error code when there is a duplicate key, in this case : the email (unique field)
          if (err.code === 11000) {
            res.status(409).json({
              success: false,
              message : "User already exists."
            });
          } else if (err.message === "Invalid email.") {
            res.status(400).json({
              success: false,
              message : err.message
            });
          }
          else {
            res.status(500).json({
              success: false,
              message : "Server error, unexpected behaviour."
            });
          }
        } else {
          res.status(200).json({
            success: true,
            message : "User saved successfully."
          });
        }
      });
    }
    // Mandatory fields are missing or not found
    else {
      res.status(400).json({
        success: false,
        message : "Wrong or missing arguments, sorry :)"
      });
    }
  },
  delete: function(req, res, next) {
    // Check if users mandatory fields are existing
    if (req.params.email) {
      User.findOneAndRemove(req.params.email, function(err) {
        if (err) {
          res.status(500).json({
            success: false,
            message : "Server error, unexpected behaviour."
          });
        } else {
          res.status(200).json({
            success: true,
            message : "User removed successfully."
          });
        }
      });
    }
    else {
      res.status(400).json({
        success: false,
        message : "Wrong or missing arguments, sorry :)"
      });
    }
  }
};
