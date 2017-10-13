var Q=require('q');
var moment = require('moment');//gestione date e tempo
var passport = require('passport');

var cfg = require("./config.js");
var Project = require('./models/project.js');
var GenericData = require('./models/genericData.js');
var Transaction = require('./models/transaction.js');
var User = require('./models/user.js');
var errorCodes= require('./errorCodes.js');

var apiUtilities = this;

// come fosse una libreria
module.exports = apiUtilities;

/**
 * Function that update money collected by the projects
 */
this.updateActualMoney= function(){
/* //////USARE SE SI VUOLE METTERE UNA CREAZIONE DI GenericData SE NON PRESENTE
    myId: "0",
    cacheDateProjectActualMoney: new Date()
  });

  genD.save(function (err, results) {
    if (err) {
      console.log("Da updateActualMoney | error in create GenericData table | "+err);
    }
  });
*/

  GenericData.findOne({myId:"0"}, function (err, result) {
    if (err) {
      console.log("Error "+ err);
      return;
    }
    tmpDate=new Date();
    //salvo tmpDate anche sul db
    lastUpdateDate= result.cacheDateProjectActualMoney;
    console.log("Da updateActualMoney : Data Attuale"+tmpDate);
    console.log("Da updateActualMoney : Ultimo update "+lastUpdateDate);
    var jobQueries = [];

    Transaction
    .aggregate([
    {
        "$match": {
          $and:[
              {
                date:{
                $gte:lastUpdateDate,
                $lt: tmpDate
              }
            },{type:'LOAN'}
          ]
        }
      },
      {
        "$group": {
          "_id": "$projectRecipient",
          "totalMoney": { "$sum": "$money" }
        }
      }

    ], function(err,results) {
        if(results!=undefined){
          results.forEach(function(p) {
            jobQueries.push(Project.update({_id:p._id},{'actualMoney.cacheDate':tmpDate, $inc:{'actualMoney.money':p.totalMoney}}).exec());//aggiungere quelle già sommate in passato
          });
        }
    });

    Q
    .all(jobQueries )
    .then(function(listOfJobs) {
      console.log("Da updateActualMoney "+ 'Update successful!')
      GenericData.update({myId:"0"}, {'$set': {cacheDateProjectActualMoney: tmpDate}}, function (err) {
        if (err) {
          console.log("Da updateActualMoney | Errore nell'aggiornamento di cacheDateProjectActualMoney | "+ err)
        }
      });
    }).catch(function(error) {
        console.log("Da updateActualMoney "+ errorCodes.ERR_DATABASE_OPERATION +' Generic Database error '+ error);
    });
  });
};

this.closeProject=function(idProject, idUser){
  var deferred = Q.defer();
  var query=null;
  if(idUser!=null && idUser!=undefined){
    query={$and:[{_id:idProject},{'status.value':'ACCEPTED'},{'owner':idUser}]};
  }else{
    query={$and:[{_id:idProject},{'status.value':'ACCEPTED'}]};
  }
      console.log(query);
  Project
  .findOneAndUpdate(query,{'$set': {'status.value': 'CLOSED'}},{new: true})
  .exec(function (err, project) {
    if (err) {
        console.log("closeProject(idProject, idUser)"+err.message);
        throw err;
    }

    var tran = new Transaction({
      sender: global.idMEALMEAL,
      recipient: project.owner,
      money: project.actualMoney.money,
      notes: 'Money collected for a project',
      projectRecipient:project._id,
      type:'MOVEMENT_TO_OWNER'
    });
    tran.save(function (err, results) {
      if (err) {
        console.log("Error in close project "+ err);
        deferred.reject(err);
      }
      console.log("Project closed successfully");
      deferred.resolve("ok");
    });
  });
  return deferred.promise;
}

this.closeProjectAll=function(){
  Project
  .find({$and:[{'status.value':'ACCEPTED'}, {'endDate':{$lt: Date.now()}}]})
  .stream()
  .on('data', function(project){
    console.log(project);
    apiUtilities.closeProject(project._id, project.owner);
  })
  .on('error', function(err){
    console.log("Error in close project of one of the multiple project "+ err);
  })
  .on('end', function(){
    console.log("Project closed successfully");
  });
}

this.returnMoney=function(idProject, idUser){
  var deferred = Q.defer();
  var query=null;
  if(idUser!=null && idUser!=undefined){
    query={$and:[{_id:idProject},{'status.value':'CLOSED'},{'owner':idUser}]};
  }else{
    query={$and:[{_id:idProject},{'status.value':'CLOSED'}]};
  }
  Project
  .findOneAndUpdate(query,{'$set': {'status.value': 'CLOSED_&_RESTITUTED'}},{new: true})
  .exec(function (err, project) {
    if (err) {
        console.log("returnMoney(idProject, idUser)"+err.message);
        throw err;
    }
    Transaction
    .find({$and:[{projectRecipient: idProject}, {type:'LOAN'}]})
    .stream()
    .on('data', function(loan){
      money=loan.money+(loan.money/100)*project.restitution.interests;
      var returnLoan = new Transaction({
        sender: project.owner,
        recipient:loan.sender,
        projectRecipient: loan.projectRecipient,
        money: money,
        loanId: loan._id,
        notes: "Restituzione soldi adempimento prestito",
        type:'LOAN_RESTITUTION_FROM_OWNER'
      });
      returnLoan.save(function (err, results) {
        if (err) {
          console.log("Da returnMoney, returnLoan.save :"+ err);
          throw err;
        }
      });
    })
    .on('error', function(err){
      console.log("Error in return money of single project "+ err);
      deferred.reject(err);
    })
    .on('end', function(){
      console.log("Money return successfully");
      deferred.resolve("ok");
    });
  });
  return deferred.promise;
}

this.returnMoneyAll=function(){
  Project
  .find({$and:[{'status.value':'CLOSED'}, {'restitution.date':{$lt: Date.now()}}]})
  .stream()
  .on('data', function(project){
    apiUtilities.returnMoney(project._id, project.owner);
  })
  .on('error', function(err){
    console.log("Error in return money of one of the multiple project "+ err);
  })
  .on('end', function(){
    console.log("Money return successfully");
  });
}

this.checkMEALAccountOrCreate=function(){
  User.find({username:'MEALMEAL'})
  .then(function(result, err){
    if(err){
      console.log(err.stack);
    }else {
      if(result.length==0){
        var user=new User({
          username: 'MEALMEAL',
          //password: {type:String, required:true}, Creata automaticamente tramite modulo passport
          name: 'SitoSito',
          surname: 'SitoSito',
          email: 'Sito@MEAL.it',
          bornDate: Date.now(),
          phoneNumber: '123456789',
          address:  {
            city:'Camerino',
            nation:'Italia',
            CAP:'12345'
          },
          isAdmin:true
        });
        User.register(user,
          'password', function(err, account) {
          if (err) {
            console.log(err);
          }
          console.log("Utente MEALMEAL creato");
          global.idMEALMEAL = account._id;
        });
      }else{
        console.log("Utente MEALMEAL già esistente");
        global.idMEALMEAL = result[0]._id;
      }
    }
  });
}

/**
 * Create a notification for a user
 *
 * @param  {[type]} recipient id of the user
 * @param  {[type]} message
 * @param  {[type]} type      Choose from the enum in Model.User or add a new one in the Model
 */
this.createNotification=function(recipient, message,type){
  var newNotification = {message: message, type: type};
  User.update({_id: recipient}, {$push: {notifications: newNotification}}, function (err) {
    if (err) {
      console.log("Error in Create notification: "+err.message);
    }
  });
}
