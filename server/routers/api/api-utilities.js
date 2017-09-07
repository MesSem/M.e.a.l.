var config      = require('../../config');    // get our config file
var jwt         = require('jsonwebtoken');    // used to create, sign, and verify tokens
var User        = require('../../models/user');   // get our mongoose User model
var Q           = require('q');  // Q promise

var db_utilities=require('../db-utilities');

var api_utilities = this;
// esporto api_utilities così posso utilizzare i suoi metodi e attributi,
// come fosse una libreria
module.exports = api_utilities;




// =======================
// ERROR CODES
// =======================
this.ERR_API_NOT_FOUND = 'ERR_API_NOT_FOUND';
this.ERR_API_WRONG_PSW = 'ERR_API_WRONG_PSW';




// =======================
// FUNCTIONS
// =======================

/* registra e aggiunge un utente al db */
this.addUser = function(name, password)
{
  return db_utilities.addUser({name:name, 
                               password:password,
                               admin:false
                              });  //ritorna una promessa
  }



this.login = function(name, psw) 
{ 
  var deferred = Q.defer();
    
  // find the user
  User.findOne({ name: name})
      .then(function(user) 
        {
         if (!user) 
          { deferred.reject({code:this.ERR_API_NOT_FOUND,
                             msg:'utente non trovato'});  
          } 
        else 
          {
            // check if password matches
            if (user.password != psw) 
              { deferred.reject({code:this.ERR_API_WRONG_PSW,
                                 msg:'credenziali errate'}); 
              } 
            else 
              {
               // if user is found and password is right
               // create a token
               console.log( config.secret);
               var token = jwt.sign(user, 
                                    config.secret, 
                                    {expiresIn: 1440}
                                 );
               // return the information including token as JSON
               deferred.resolve(token);
          }   
        }
      })
     .catch(function(err)
        {
         // altri possibili errori
         deferred.reject({code:"", msg:err}); 
        }); 
 return deferred.promise;
}