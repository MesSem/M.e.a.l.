var User = require('./models/user.js');
var cfg = require("./config.js");
var errorCodes= require('./errorCodes.js');
var jwt = require("jwt-simple");
var moment = require('moment');//gestione date e tempo

module.exports = function(req, res, next) {

  return {
    /**
     * Method for authentication of simple users
     */
      authenticate: function(req, res, next) {
        try{
          //Recover of token and decoding
          //var token = req.headers.authorization.split(' ')[1];
          var token = req.cookies.token;
          var payload = jwt.decode(token, cfg.jwtSecret);//esiste libreria per farlo in modo asincrono
          //Check if the token is expired, If sessionOpen is setted, the token never expired
          if((payload.sessionOpen!=undefined && payload.sessionOpen) || moment().unix()<payload.expr){
            //Token not expired
            //Take information of the user from the db
            User.findOne({_id: payload.id}, function(err, user) {
              if (err) {
                res=errorCodes.sendError(res, errorCodes.ERR_USER_NOT_FOUND,'User with id in the token not found',err,401 );
              }
              //User exist, return of the user id
              if (user) {
                req.userId = payload.id;
                //Creazone del payload del token
                var newPayload = {
                    id: req.userId,
                    sessionOpen:(payload.sessionOpen != undefined) ? payload.sessionOpen :false,
                    expr:moment().add(cfg.timeSessionToken, "hours").unix()
                };
                //Risetto il token aggiungendo al tempo attuale altro tempo
                res.cookie('token',jwt.encode(newPayload, cfg.jwtSecret), { /*maxAge: 900000,*/ httpOnly: true });
                next();
              } else {
                res=errorCodes.sendError(res, errorCodes.ERR_API_UNAUTHORIZED,'User unauthorized, it\' isn\'t an user',new Error("Error in auth.authenticate()"),401 );
              }
            });
          }else{
            res=errorCodes.sendError(res, errorCodes.ERR_TOKEN_EXPIRED,'Token expired', new Error("Error in auth.authenticate()"),498 );
          }
        }catch(err){
          res=errorCodes.sendError(res, errorCodes.ERR_JWT_TOKEN_NOT_FOUND,'No JWT token in the header',err,401 );
        }
      },
      /**
       * Method for authentication of admin users
       */
      authenticateAdmin: function(req, res, next) {
        try{
        //var token = req.headers.authorization.split(' ')[1];
        var token = req.cookies.token;
        var payload = jwt.decode(token, cfg.jwtSecret);//esiste libreria per farlo in modo asincrono
        if((payload.sessionOpen!=undefined && payload.sessionOpen) || moment().unix()<payload.expr){
          User.findOne({_id: payload.id}, function(err, user) {
            if (err) {
              res=errorCodes.sendError(res, errorCodes.ERR_USER_NOT_FOUND,'Admin user with id in the token not found',err,401 );
            }
            if (user && user.isAdmin) {
              req.userId = payload.id;
              //Creazone del payload del token
              var newPayload = {
                  id: req.userId,
                  sessionOpen:(payload.sessionOpen != undefined) ? payload.sessionOpen :false,
                  expr:moment().add(cfg.timeSessionToken, "hours").unix()
              };
              //Risetto il token aggiungendo al tempo attuale altro tempo
              res.cookie('token',jwt.encode(newPayload, cfg.jwtSecret), { /*maxAge: 900000,*/ httpOnly: true });
              next();
            } else {
              res=errorCodes.sendError(res, errorCodes.ERR_API_UNAUTHORIZED,'User unauthorized, it\' isn\'t an admin',new Error("Error in auth.authenticateAdmin()"),401 );
              }
            });
          }else{
            res=errorCodes.sendError(res, errorCodes.ERR_TOKEN_EXPIRED,new Error('Token expired',"Error in auth.authenticateAdmin()"),498 );
          }
        }catch(err){
          res=errorCodes.sendError(res, errorCodes.ERR_JWT_TOKEN_NOT_FOUND,'No JWT token in the header',err,401 );
        }
      },
      deauthenticate:function(req, res, next) {
        res.cookie('token','deleted', { /*maxAge: 900000,*/ httpOnly: true });
      }
  };
};
