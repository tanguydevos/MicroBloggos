"use strict";

var express = require('express');
var path = require('path');
var userController = require('../controllers/userController');
var router = express.Router();

router.get('/', userController.show);
router.post('/new', userController.new);
router.delete('/delete/:email', userController.delete);

module.exports = router;
