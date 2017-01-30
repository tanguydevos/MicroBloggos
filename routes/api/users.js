"use strict";

var express = require('express'),
    userController = require('../../controllers/userController'),
    auth = require('authenticate'),
    secret = require('../../config').secret,
    router = express.Router();

router.get('/', auth({ secret: secret }), userController.show);
router.post('/', userController.new);
router.delete('/delete/:email', userController.delete);
router.post('/authenticate', userController.authenticate);

module.exports = router;
