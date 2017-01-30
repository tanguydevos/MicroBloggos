"use strict";

var mongoose = require('mongoose'),
    config = require('../config');

module.exports = {
    connect: function(callback) {
        mongoose.connect(config.database, callback);
    }
};
