"use strict";

var express = require('express'),
    userController = require('../../controllers/userController'),
    auth = require('../../Utils/authenticate'),
    secret = require('../../config/config').secret,
    router = express.Router();

router.get('/', userController.showAll)
    .get('/:id', userController.show)
    .post('/', userController.new)
    .post('/authenticate', userController.authenticate)
    .put('/:id', auth({ secret: secret }), userController.update)
    .delete('/:id', auth({ secret: secret }), userController.delete);

module.exports = router;
