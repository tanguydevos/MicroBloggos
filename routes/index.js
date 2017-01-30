"use strict";

var path = require('path'),
    express = require('express'),
    router = express.Router();

/* Send all GET requests to a single page (SPA) */
router.get('*', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../public/views/template.html'));
});

module.exports = router;
