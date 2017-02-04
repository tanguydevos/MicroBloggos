"use strict";

var mongoose = require('mongoose'),
    config = require('../config/config');

mongoose.Promise = require('bluebird');
mongoose.connect(config.database);

// When successfully connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open :)');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

// Models
require('./User');
