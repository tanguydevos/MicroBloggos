'use strict';

var mongoose = require('mongoose');

module.exports = {
  connect: function(callback) {
    mongoose.connect("mongodb://jaybles:jaybles@ds161028.mlab.com:61028/jaybles", callback);
  }
};
