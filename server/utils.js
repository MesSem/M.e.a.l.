var Q=require('q');
var moment = require('moment');//gestione date e tempo

var cfg = require("./config.js");
var Project = require('./models/project.js');
var GenericData = require('./models/genericData.js');
var Transaction = require('./models/transaction.js');
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
            jobQueries.push(Project.update({_id:p._id},{actualMoney:{money:p.totalMoney,cacheDate:tmpDate}}).exec());//aggiungere quelle già sommate in passato
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
  var afterUpdate=function (err, affected) {
    if (err) {
        console.log(err);
    }
    console.log("Da closeProject: Progetti chiusi(non restituisce il parametro giusto)="+ affected.ok);
  };
  if(idProject!=null){
      return Project.update({$and:[{_id:idProject},{'status.value':'ACCEPTED'},{'owner':idUser}]},{'$set': {'status.value': 'CLOSED'}}).exec();
  }else{
      Project.update({$and:[{endDate:{$lt: Date.now()}},{'status.value':'ACCEPTED'}]},{'$set': {'status.value': 'CLOSED'}}, {multi: true}).exec(afterUpdate);
  }
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
