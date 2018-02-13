// =======================
// USER ROUTES
// =======================

var express = require('express');
var passport = require('passport');
var multer = require('multer');
var Q=require('q');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');
var sharp = require("sharp");

var auth = require("../../auth.js")();
var errorCodes= require('../../errorCodes.js');
var utils= require('../../utils.js');

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');
var Project= require('../../models/project.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();
a=errorCodes.ERR_API_NOT_FOUND;

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
  auth.deauthenticate(req, res, null)
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
  User.findOne({_id: req.userId}, function(err, user) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error finding user', err, 500);
    }
    if (user) {
      user.cards.forEach(card => {
        card.cvv = undefined;//rimuovo per sicurezza

        var length = card.number.length;
        var latest = card.number.slice((length - 4), length);

        card.number = Array(length - 4).join("*") + latest;//oscuro per sicurezza
      });
      res.status(200).json({
        user: user
      });
    } else {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error finding user', err, 500);
        // or you could create a new account
    }
  });
});

/**
 * @api {post} /api/user/user Update user info
 * @apiName User
 * @apiGroup User
 *
 * @apiParam {User} user User to update in the database
 *
 * @apiSuccess {String} status Message if the editing it's ok
 *
 */
userRoutes.post('/user', function(req, res) {
    var userData = req.body;

    if (userData.username)
      delete userData.username;

    var userId = req.userId;
    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete userData._id;

    User.update({_id : userId}, {"$set" : userData}, function(err){
      if (err) {
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating user info', err, 500);
      }
      res.status(200).json({
        status: 'Update successful!'
      });
    });
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
    var userId = req.userId;

    var newCard = {number: req.body.number, endDate: req.body.endDate, cvv: req.body.cvv};

    User.update({_id: userId}, {$push: {cards: newCard}}, function (err) {
      if (err) {
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error adding new card', err, 500);
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
  var userId = req.userId;
  var cardId = req.query.card;

  if(!userId || !cardId) {
    return errorCodes.sendError(res, errorCodes.ERR_INVALID_REQUEST, 'Invalid parameters!', err, 500);
  }

  User.update({_id: userId}, {$pull: {cards: {_id: cardId}}}, function (err) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error deleting card', err, 500);
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
  User.find({}, '_id username', function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting users list', err, 500);
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
  var tran = new Transaction({
    sender: req.body.sender,
    recipient: req.body.recipient,
    money: req.body.money,
    notes: req.body.notes

  });

  tran.save(function (err, results) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error creating transaction', err, 500);
    }
    res.status(200).json({
      status: 'Added successfully!'
    });
    utils.createNotification(req.body.recipient, "Hai ricevuto "+req.body.money + "€ da un utente. Per più informazioni guarda lo storico","RECEIVED_TRANSACTION");
  });

});

/**
 * @api {get} /api/user/transaction Get all transaction
 * @apiName GetTransactions
 * @apiGroup User
 *
 *
 * @apiSuccess {[Transaction]} transactions list of all transactions of thi user
 */
userRoutes.get('/transaction', function(req, res) {
  //Transaction.find({$or: [{'sender': req.user._id}, {recipient: req.user._id}]}, function (err, result) {
  Transaction.find({$and :[{$or: [{'sender': req.userId}, {recipient: req.userId}]}, {type:''}]})
  .populate('sender', '_id, username')
  .populate('recipient', '_id, username')
  .exec(function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting transactions list', err, 500);
    }
    console.log(result);
    res.status(200).json({
      transactions: result
    });
  });


});

rsDir = 'uploads';
uploadDir = 'app/' + rsDir;
tempDir = uploadDir + path.sep + 'temp';
//controllo se esistono cartelle, in caso negativo le creo - cartella temporanea prima di mettere il record nel db
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(tempDir))
  fs.mkdirSync(tempDir);

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    //console.log(file);
    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])//genero nome file
  }
});
//ci sarebbe da metterlo dentro la route, se esterno potrebbe causare problemi di sicurezza, ma a quanto pare non funziona da dentro
//https://github.com/expressjs/multer
var upload = multer({ //multer settings
                storage: storage,
                onError : function(err, next) {
                  console.log("err.message");
                  return errorCodes.sendError(res, errorCodes.ERR_INVALID_REQUEST, 'Error in request parameters', err, 500);
                }
            }).any();//uso any perchè sembra l'unico funzionante

function resizeImage(input, output) {//ridimensiona con dimensioni massime 1024
  sharp.cache(false);//fix per risorse occupate - windows
  sharp(input)
  .resize(1024, 1024)
  .max()
  .toFormat('jpeg')
  .toFile(output)
  .then(function() {
    fs.unlinkSync(input);
  });
}

//SE SI VUOLE FILTRARE IL FILE ESISTE OPZIONE fileFilter, guardare sulla guida di multer
userRoutes.post('/project', upload, function(req, res) {//registrazione o update
  var form = req.body.form;

  User.findOne({'_id':req.userId}, function(err, user){//controllo che l'utente sia verificato
    if (user.verified !== 'VERIFIED') {
      return errorCodes.sendError(res, errorCodes.ERR_OPERATION_UNAUTHORIZED, 'User not verified', new Error("User not verified"), 500);
    }
    else {
  
      if (req.files.length < 1)//controllo la presenza di immagini
        return errorCodes.sendError(res, errorCodes.ERR_INVALID_REQUEST, 'Main image missing', err, 500);

      var gallery = [];

      for (var key in req.files) {//trovo immagine principale e immagini galleria
        el = req.files[key];
        if (el.fieldname == 'file[main]')
          mainImage = el.path;
        else if (el.fieldname == 'file[gallery]')
          gallery.push(el.path);
      }

      var proj = new Project({
        owner: req.userId,
        name: form.name,
        description: form.description,
        image: 'temp',//req.files[0].path,
        imagesGallery: [],//gallery,
        endDate:form.endDate,
        restitution: {
          date: form.restitution.dateRestitution,
          interests: form.restitution.interests
          },
        requestedMoney: form.requestedMoney,
        actualMoney:{money:0, date:Date.now()}
      });

      proj.save(function (err, results) {
        if (err) {
          //in caso di errore elimino tutte le immagini caricate
          fs.unlinkSync(mainImage);
          for (var key in gallery) {
            fs.unlinkSync(gallery[key]);
          }
          return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error saving new project', err, 500);
        }
        //sposto le immagini nella cartella una volta che ho _id del progetto - rename(vecchia_dir, nuova_dir)
        projDir = uploadDir + path.sep + proj._id;
        realProjDir = rsDir + path.sep + proj._id;
        if (!fs.existsSync(projDir))
          fs.mkdirSync(projDir);


        var mainImageName = mainImage.split(path.sep).pop();

        resizeImage(mainImage, projDir + path.sep + mainImageName);

        var mainImagePath = realProjDir + path.sep + mainImageName;


        for (var key in gallery) {
          var galleryName = gallery[key].split(path.sep).pop();

          resizeImage(gallery[key], projDir + path.sep + galleryName);

          gallery[key] = realProjDir + path.sep + galleryName;
        }

        Project.update({_id: proj._id}, {'$set': {image: mainImagePath, imagesGallery: gallery}}, function (err) {
          if (err) {
            return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error saving images inside project', err, 500);
          }
        });

        res.status(200).json({
          status: 'Added successfully!'
        });
      });

    }
  });


});

/**
 * @api {get} /api/user/listProjects Get all projects
 * @apiName listProjects
 * @apiGroup User
 *
 * @apiParam {Boolean} onlyMy If true the result is only the projects create from thi user
 *
 * @apiSuccess {[Project]} projects list of all projects of the user
 */
userRoutes.get('/listProjects', function(req, res) {
  var afterGetProjects=function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_ELEMENT_NOT_FOUND,'Not projects found',err,500 );
    }
    res.status(200).json({
      projects: result
    });
  };
  console.log(req.query.onlyMy);
  if (req.query.onlyMy!=undefined && req.query.onlyMy){
    Project.find({'owner': req.userId})
    .populate('owner',{username:'username', _id:'id'})
    .exec(afterGetProjects);
  }else {
    Project.find({"status.value" : 'ACCEPTED'})
    .populate('owner',{username:'username', _id:'id'})
    .exec(afterGetProjects);
  }
});

/**
 * @api {get} /api/user/detailsProject Get details of one Project
 * @apiName detailsProject
 * @apiGroup User
 *
 * @apiParam {int} id Id of one project
 *
 * @apiSuccess {Project} project Information of requested project
 */
userRoutes.get('/detailsProject', function(req, res) {
  var afterGetProject=function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_ELEMENT_NOT_FOUND,'Not project found',err,500 );
    }else{
      if((result.status.value == 'TO_CHECK' || result.status.value == 'NOT_ACCEPTED') && req.userId != result.owner._id && !req.isAdmin){//solo il proprietario può vedere un progetto in attesa o rifiutato
        return errorCodes.sendError(res, errorCodes.ERR_PROJECT_NOT_ACCEPTED,'Project isn\'t accepted' ,new Error('Accepted field of the project is false'),500 );
      }else{
        res.status(200).json({
          project: result
        });
      }
    }
  };
  if (req.query.id!=undefined){
    Project.findOne({'_id': req.query.id})
    .populate('owner',{/*name:'name',*/username:'username', _id:'id'})
    .populate('comments.user',{/*name:'name',*/username:'username', _id:'id'})
    .exec(afterGetProject);
  }else {
    return errorCodes.sendError(res, errorCodes.ERR_QUERY_PARAMETER,'There isn\'t id in the query',new Error('Query without id'),500 );
  }
});

/**
 * @api {post} /api/user/loan Create a loan
 * @apiName CreateLoan
 * @apiGroup User
 *
 * @apiParam {Loan} body
 *
 * @apiSuccess {String} status message
 */
userRoutes.post('/loan', function(req, res) {//registrazione o update
  var tran = new Transaction({
    sender: req.userId,
    recipient:global.idMEALMEAL,
    projectRecipient: req.body.projectRecipient,
    money: req.body.money,
    notes: req.body.notes,
    type:'LOAN'
  });

  tran.save(function (err, results) {
    if (err) {
      res=errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION,'Error during the creation of the loan',err,500 );
      return res;
    }
    res.status(200).json({
      status: 'Added successfully!'
    });
  });

});

/**
 * @api {get} /api/user/changePw Change password
 * @apiName changePw
 * @apiGroup User
 *
 * @apiParam {newPw} new password
 *
 * @apiSuccess {success}
 */
userRoutes.post('/changePw', function(req, res) {
  oldPw = req.body.oldPw;
  newPw = req.body.newPw;

  User.findOne({_id: req.userId}, function(err, user) {

    if (user) {
      user.changePassword(oldPw, newPw, function(err, result) {
        if (err) {
          return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error changing password', err, 500);
        }
        res.status(200).json({
          status: 'Password changed!'
        });
      });
    }
  });
});

/**
 * @api {get} /api/user/editProject Edit a project
 * @apiName editProject
 * @apiGroup User
 *
 * @apiParam {description}
 * @apiParam {image}
 * @apiParam {imagesGallery}
 *
 * @apiSuccess {success}
 */
userRoutes.post('/editProject', function(req, res) {
  var projectData ={
    description:req.body.description
    ////image:req.body.name,
    ///imagesGallery:[{type:String}]
  };
  var userId = req.userId;
  var projectId=req.body._id;

  Project.update({$and:[{_id : projectId},{owner:userId}]}, {description:req.body.description}, function(err, affected){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating project info', err, 500);
    }else if(affected.ok==0){
      return errorCodes.sendError(res, errorCodes.ERR_OPERATION_UNAUTHORIZED, 'You can\'t edit other project', new Error("On editing project"), 500);
    }

    res.status(200).json({
      status: 'Update successful!'
    });
  });
});

//.map funzione interessante per applicare funzione per ogni elemento di un array
/**
 * @api {get} /api/user/listLoanForProject Get loans for one project
 * @apiName listLoanForProject
 * @apiGroup User
 *
 * @apiParam {Int} idP Id of the project
 *
 * @apiSuccess {[Loan]} loans list of all loans of the project
 */
userRoutes.get('/listLoanForProject', function(req, res) {
  /*Project.find({$and:[{'owner':req.userId},{'_id':req.query.idP}]}).exec();/*.select("post")*/
/*  promise.then(function (project) {*/
  Project
  .findOne({$and:[{'owner':req.userId},{'_id':req.query.idP}]})
  .then(function (project) {
    if(project.length==0){
      return errorCodes.sendError(res, errorCodes.ERR_OPERATION_UNAUTHORIZED ,'Id of another user\'s project',new Error("You are asking information of another user's project"),500 );
      }
    return Transaction
              .find({'projectRecipient':project._id})
              .populate('sender',{username:'username', _id:'id'})
              .exec();
  }).catch(function(err){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION,'The id of the project is wrong',err,500 );
    }
  }).then(function (result) {
    return res.status(200).json({
      loans: result
    });
  }).catch(function(err){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION,'Error',err,500 );
    }
  });
});

/**
  * @api {get} /api/user/returnMoney return the money of one project
 * @apiName returnMoney
 * @apiGroup User
 *
 * @apiParam {idPr} id of the project
 *
 * @apiSuccess {success}
 */
userRoutes.get('/returnMoney', function(req, res) {
  utils.returnMoney(req.query.idP, req.userId)
  .then(function (a) {
    return res.status(200).json({
      status: 'Update successful!'
    });
  }).catch(function(err){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION,'Error',err,500 );
    }
  });
});

/**
 * @api {get} /api/publicUser Get public info about user
 * @apiName publicUser
 * @apiGroup Api
 *
 * @apiSuccess {[User]} info about user
 */
userRoutes.post('/publicUser', function(req, res) {

  id = req.body.id;

  User.findOne({_id: id}, 'username', function(err, user) {
    if (user) {
      Project.find({ $and:[{'status': {'value' : 'ACCEPTED'}},{'owner': id}]}, function(err, projects) {
        res.status(200).json({
          user: user,
          projects: projects
        });

      });
    }
    else {
      return errorCodes.sendError(res, errorCodes.ERR_ELEMENT_NOT_FOUND, 'No user found', err, 500);
    }
  });
});

/**
 * @api {delete} /api/deleteNotifications Delete notifications of the current user
 * @apiName deleteNotifications
 * @apiGroup User
 *
 * @apiSuccess {String} info about user
 */
userRoutes.delete('/deleteNotifications', function(req, res) {
  User.findOne({'_id':req.userId}, function(err, user){

    if (user) {
      console.log(user);
      user.notifications.forEach(function (notif) {
        if (notif.seen == false)
          notif.seen = true;
      })
      user.save(function(err) {
        if (err) {
          console.log(err.message);
          return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error in deleting notification of current user', err, 500);
        }
      });
    }
    else {
      return errorCodes.sendError(res, errorCodes.ERR_ELEMENT_NOT_FOUND, 'No user found', err, 500);
    }

    res.status(200).json({
      status: 'Notifications deleted successful!'
    });
  });
});

/**
 * @api {get} /api/user/listLoans Get all loans of this user
 * @apiName listLoans
 * @apiGroup User
 *
 *
 * @apiSuccess {[Loan]} loans list of all loans of this user
 */
userRoutes.get('/listLoans', function(req, res) {
  var arrayOfLoans=[];
  var promises=[];
  Transaction
  .find({$and:[{sender: req.userId}, {type:{ $ne: '' }}]})
  .populate('projectRecipient',{name:'name', _id:'id'})
  .populate('sender',{username:'username'})
  .lean()
  .stream()
  .on('data', function(loan){
    promise=Transaction.find({$and:[{loanId: loan._id}, {type:'LOAN_RESTITUTION_FROM_OWNER'}]}, function (err, result) {
      if (err) {
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting loan data', err, 500);
      }
      if(result.length!=0){
      //  loan.toJSON();
        loan['returnMoney']=result[0].money;
        loan['returnDate']=result[0].date;

      }
      console.log( loan);
      arrayOfLoans.push(loan);
    }).exec();
    promises.push(promise);
  })
  .on('error', function(err){
    console.log( "catch");
    return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting loan data', err, 500);
  })
  .on('end', function(){
    console.log( "end");
    Q.all(promises).then(function(){
      return res.status(200).json({
        loans: arrayOfLoans
      });
    });

  });
});

/**
 * @api {post} /api/newNotification Create a new notification
 * @apiName newNotification
 * @apiGroup Api
 *
 * @apiSuccess {success}
 */
userRoutes.post('/newNotification', function(req, res) {

  message = req.body.message;
  recipient = req.body.recipient;

  utils.createNotification(recipient, message, 'GENERAL');

  res.status(200).json({
    status: 'Notifications created successfully!'
  });

});

/**
 * @api {post} /api/newComment Create a new comment
 * @apiName newComment
 * @apiGroup Api
 *
 * @apiSuccess {success}
 */
userRoutes.post('/newComment', function(req, res) {

    idProject = req.body.idProject;
    var newComment = {user: req.userId, text: req.body.text};

    Project.update({_id: idProject}, {$push: {comments: newComment}}, function (err) {
      if (err) {
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error adding new comment', err, 500);
      }
      Project.findOne({'_id': req.body.idProject}, function(err, project) {
        if (err) {
          return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error finding project', err, 500);
        }
        if (project) {
          utils.createNotification(project.owner, "Il tuo progetto\""+project.name+"\" ha un nuovo commento", 'GENERAL');
        } else {
          return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error finding project', err, 500);
        }
      });
      res.status(200).json({
        status: 'Added successfully!'
      });
    })
});

var uploadID = multer({ //multer settings -- caricamento documento identità
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      dirID = 'app/uploads/' + req.userId + '/ID';
      if (!fs.existsSync(dirID)) //controllo directory
        fs.mkdirSync(dirID);
        
      fs.readdir(dirID, (err, files) => {
        fs.unlinkSync(path.join(dirID, files[0]));//elimino eventuale doc caricato in precedenza
      });

      cb(null, dirID)
    },
    filename: function (req, file, cb) {
      cb(null, 'IDdoc' + path.extname(file.originalname))
    }
  }),
  onError : function(err, next) {
    console.log("err.message");
    return errorCodes.sendError(res, errorCodes.ERR_INVALID_REQUEST, 'Error uploading document', err, 500);
  }
}).any();//uso any perchè sembra l'unico funzionante

/**
 * @api {post} /user/uploadDoc Upload identity document
 * @apiName uploadDoc
 * @apiGroup Api
 *
 * @apiSuccess {success}
 */
userRoutes.post('/uploadDoc', uploadID, function(req, res) {
  
  if (req.files.length !== 1)
    return errorCodes.sendError(res, errorCodes.ERR_INVALID_REQUEST, 'Document missing', err, 500);

  User.findById(req.userId, function (err, user) {
    if (err)
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error finding user', err, 500);
  
    user.verified = 'WAITING';
    user.save(function (err) {
      if (err)
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating user', err, 500);

      res.status(200).json({
        status: 'Document uploaded successfully!'
      });
    });
  });

});

module.exports = userRoutes;
