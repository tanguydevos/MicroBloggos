"use strict";

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    validator = require('validator');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    var user = this;
    // Check email validity
    if (user.isModified('email')) {
        if (!validator.isEmail(this.email)) {
            var error = new Error();
            error.name = "InvalidEmail";
            return next(error);
        }
    }
    // Check if password is modified, then encrypt it thanks to bcrypt
    if (!user.isModified('password')) {
        return next();
    } else {
        bcrypt.hash(user.password, null, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    }
});

// Method to compare password to encrypted one
userSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model("User", userSchema);
