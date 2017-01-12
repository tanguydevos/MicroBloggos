"use strict";

var path = require('path');

module.exports = function (app) {
  // Users routing
  app.use('/users', require("./users"));

  /* Send all GET requests to a single page (SPA) */
  app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/views/', 'template.html'));
  });
};
