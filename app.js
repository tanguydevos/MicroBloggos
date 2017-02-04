"use strict";

var express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Db = require('./models/Db');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Set routes */
app.use('/api/users/', require('./routes/api/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Request not found.');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message
    });

    // Write error to console
    console.error("Status : " + err.status + "\n" + err.stack);
});

module.exports = app;
