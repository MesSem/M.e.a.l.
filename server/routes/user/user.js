// =======================
// USER ROUTES
// =======================

var express = require('express');
var userRoutes = express.Router();
var passport = require('passport');

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();

/* ========================================
  Signup of a user, params:
   { name:"", password:""}
*/

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */


userRoutes.post('/login', function(req, res, next) {
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

userRoutes.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

userRoutes.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }
  res.status(200).json({
    status: true
  });
});

userRoutes.get('/user', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }
  res.status(200).json({
    user: req.user
  });
});

userRoutes.post('/user', function(req, res) {//registrazione o update
  if(req.body._id) {//se sto facendo l'update

    if (!req.isAuthenticated()) {
      return res.status(200).json({
        logged: false
      });
    }
    var userData = req.body;

    var userId = req.body._id;
    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete userData._id;

    User.update({_id : userId}, {"$set" : userData}, function(err){
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
    });

    res.status(200).json({
      status: 'Update successful!'
    });

  } else {//se sto registrando

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

  }
});

userRoutes.post('/card', function(req, res) {//registrazione o update
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        logged: false
      });
    }

    if(!req.body._id) {
      return res.status(200).json({
        error: 'Id not included'
      });
    }

    var userId = req.body._id;

    var newCard = {number: req.body.number, endDate: req.body.endDate, cvv: req.body.cvv};

    User.update({_id: userId}, {$push: {cards: newCard}}, function (err) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }

      res.status(200).json({
        status: 'Added successfully!'
      });
    })
});

userRoutes.delete('/card', function(req, res) {//registrazione o update
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }

  var userId = req.query.user;
  var cardId = req.query.card;

  if(!userId || !cardId) {
    return res.status(200).json({
      error: 'Id not included'
    });
  }

  User.update({_id: userId}, {$pull: {cards: {_id: cardId}}}, function (err) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    res.status(200).json({
      status: 'Removed successfully!'
    });
  })
});

userRoutes.get('/list', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }

  User.find({}, '_id username', function (err, result) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    return res.status(200).json({
      users: result
    });
  });

});

userRoutes.post('/transaction', function(req, res) {//registrazione o update
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }

  /*if(!req.body.sender || !req.body.recipient) {
    return res.status(200).json({
      error: 'Id not included'
    });
  }*/

  var tran = new Transaction({
    sender: req.body.sender,
    recipient: req.body.recipient,
    money: req.body.money,
    notes: req.body.notes

  });

  tran.save(function (err, results) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    res.status(200).json({
      status: 'Added successfully!'
    });
  });

});

userRoutes.get('/transaction', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }

  Transaction.find({$or: [{'sender': req.user._id}, {recipient: req.user._id}]}, function (err, result) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    res.status(200).json({
      transactions: result
    });
  });

});


module.exports = userRoutes;
