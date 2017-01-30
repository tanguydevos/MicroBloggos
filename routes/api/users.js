"use strict";

var express = require('express'),
    userController = require('../../controllers/userController'),
    auth = require('authenticate'),
    secret = require('../../config').secret,
    router = express.Router();

router.get('/', auth({ secret: secret }), userController.show);
router.post('/', userController.new);
router.post('/authenticate', userController.authenticate);
router.put('/update/:id', auth({ secret: secret }), userController.update);
router.delete('/delete/:id', auth({ secret: secret }), userController.delete);

module.exports = router;
