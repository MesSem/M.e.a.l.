// =======================
// ADMIN ROUTES
// =======================

var express = require('express');
var router = express.Router();

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();



module.exports = adminRoutes;
