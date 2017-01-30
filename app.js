"use strict";

var express = require('express'),
    app = express(),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Db = require('./models/Db');
    
// Connect to database
Db.connect(function(err) {
    if (err) {
        return console.error("Impossible to connect to database, error message is : \n" + err.message);
    }
    // Everything is okay, let's display something positive
    console.log("Connected to database, have fun !");
    // It's time to launch the app
    launchExpressApp();
});

function launchExpressApp() {
    // Set functions
    app.set('views', path.join(__dirname, 'public/views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    /* Set routes */
    app.use('/api/users', require('./routes/api/users'));
    app.use('/', require('./routes'));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Requested route is not found.');
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
        res.end(err.message);
    });
}

module.exports = app;
