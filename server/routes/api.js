var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');


router.post('/register', function(req, res) {
  User.register(new User(req.body),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/info', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      user: false
    });
  }
  res.status(200).json({
    user: req.user
  });
});

router.post('/info', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      error: 'not logged'
    });
  }
  var userData = req.body;

  var userId = req.body._id;
  
  // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
  delete userData._id;
  
  // Do the upsert, which works like this: If no Contact document exists with 
  // _id = contact.id, then create a new doc using upsertData.
  // Otherwise, update the existing doc with upsertData
  User.update({_id : userId}, {"$set" : userData},function(error){console.log(error);});

  res.status(200).json({
    status: 'Update successful!'
  });
});


module.exports = router;