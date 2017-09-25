// =======================
// USER ROUTES
// =======================

var express = require('express');
var passport = require('passport');
var errorCodes= require('../../errorCodes.js');

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();
a=errorCodes.ERR_API_NOT_FOUND;
/*
res.status(400).json({ success: false,
                         code: err.code,
                         message: err.msg
                        });

  res.status(400).json({ success: false,
             message: 'Bad Request. name and password required.' });

             res.status(201).json({success: true,
                                   message: 'Enjoy your token!',
                                   data: {'token':token}});
 */

 /**
  * Api di prova per fare testing
  */
 userRoutes.get('/prova', function(req, res) {
   res.status(200).json({
     message: "Complimenti, puoi accedere alle api"+req.userId
   });
 });

/**
 * @api {get} /api/user/logout Logout of the current user
 * @apiName Logout
 * @apiGroup User
 */
userRoutes.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

/**
 * @api {get} /api/user/status Information of the user status
 * @apiName Status
 * @apiGroup User
 *
 * @apiSuccess {Boolean} logged True if the user is logged, false elsewhere
 */
userRoutes.get('/status', function(req, res) {
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/
  res.status(200).json({
    status: true
  });
});

/**
 * @api {get} /api/user/user Information of the current user if it's logged
 * @apiName User
 * @apiGroup User
 *
 * @apiSuccess {String} logged At false if the user isn't logged
 * @apiSuccess {User} user The current user
 */
userRoutes.get('/user', function(req, res) {
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/
  User.findOne({_id: req.userId}, function(err, user) {
    if (err) {
      res.send("error");
        //return done(err, false);
    }
    console.log(user);
    if (user) {
      res.status(200).json({
        user: user
      });
    } else {
      res.send("error");
      //  done(null, false);
        // or you could create a new account
        // return done(new Error("User not found"), null);
    }
  });





});

/**
 * @api {post} /api/user/user Insert a new user or update an old one
 * @apiName User
 * @apiGroup User
 *
 * @apiParam {User} user User to add in the database
 *
 * @apiSuccess {String} logged At false only if there is an attempt to edit an user before login
 * @apiSuccess {String} status Message if the editing it's ok
 *
 */
userRoutes.post('/user', function(req, res) {//registrazione o update
  if(req.body._id) {//se sto facendo l'update

  /*  if (!req.isAuthenticated()) {
      return res.status(200).json({
        logged: false
      });
    }*/
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

/**
 * @api {post} /api/user/card Insert of a new card
 * @apiName InsertCard
 * @apiGroup User
 *
 * @apiParam {number:{String},endDate:{type:Date},cvv:{type:Number} body Card information
 *
 * @apiSuccess {String} status Message of ther insert
 *
 */
userRoutes.post('/card', function(req, res) {//registrazione o update
    /*if (!req.isAuthenticated()) {
      return res.status(200).json({
        logged: false
      });
    }*/

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

/**
 * @api {delete} /api/user/card Delete a card
 * @apiName DeleteCard
 * @apiGroup User
 *
 * @apiParam {Number} user Users unique ID.
 * @apiParam {Number} card Cards unique ID.
 *
 * @apiSuccess {String} error
 * @apiSuccess {String} status
 */
userRoutes.delete('/card', function(req, res) {//registrazione o update
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/

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

/**
 * @api {get} /api/user/list List of all the user
 * @apiName List
 * @apiGroup User
 *
 * @apiSuccess {[User]} users List of users
 *
 */
userRoutes.get('/list', function(req, res) {
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/

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

/**
 * @api {post} /api/user/transaction Create a transaction
 * @apiName CreateTransaction
 * @apiGroup User
 *
 * @apiParam {Transaction} body
 *
 * @apiSuccess {String} status message
 */
userRoutes.post('/transaction', function(req, res) {//registrazione o update
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/

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

/**
 * @api {get} /api/user/transaction Get all transaction
 * @apiName GetTransactions
 * @apiGroup User
 *
 * @apiParam {Number} UserId
 *
 * @apiSuccess {[Transaction]} transactions list of all transactions of thi user
 */
userRoutes.get('/transaction', function(req, res) {
  /*if (!req.isAuthenticated()) {
    return res.status(200).json({
      logged: false
    });
  }*/

  //Transaction.find({$or: [{'sender': req.user._id}, {recipient: req.user._id}]}, function (err, result) {
  Transaction.find({$or: [{'sender': req.userId}, {recipient: req.userId}]}, function (err, result) {
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
