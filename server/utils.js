var Q=require('q');
var moment = require('moment');//gestione date e tempo

var cfg = require("./config.js");
var Project = require('./models/project.js');
var GenericData = require('./models/genericData.js');
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
            jobQueries.push(Project.update({_id:p._id},{actualMoney:{money:p.totalMoney,cacheDate:tmpDate}}).exec());
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
