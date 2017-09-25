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

/**
 * Api di prova per fare testing
 */
adminRoutes.get('/prova', function(req, res) {
  res.status(200).json({
    message: "Complimenti, puoi accedere alle api admin"
  });
});

module.exports = adminRoutes;
