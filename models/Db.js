"use strict";

var mongoose = require('mongoose'),
    config = require('../config');

module.exports = {
    connect: function(callback) {
        mongoose.Promise = require('bluebird');
        mongoose.connect(config.database, callback);
    }
};
