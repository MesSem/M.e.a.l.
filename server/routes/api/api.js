// =======================
// API ROUTES
// =======================

var express = require('express');
var passport = require('passport');
var jwt = require("jwt-simple");
var cfg = require("../../config.js");

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = apiRoutes;

/**
 * Api di prova per fare testing
 */
apiRoutes.get('/prova', function(req, res) {
  res.status(200).json({
    message: "Complimenti, puoi accedere alle api"
  });
});

/**
 * @api {post} /api/login User login
 * @apiName Login
 * @apiGroup Api
 *
 * @apiParam {User} the user data--->mettere meglio
 */
apiRoutes.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    var payload = {
        id: user.id
    };
    var token = jwt.encode(payload, cfg.jwtSecret);
    res.status(200).json({
        token: token,
        status: 'Login successful!'
    });
  })(req, res, next);
});
