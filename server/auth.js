var passportJWT = require("passport-jwt");
var User = require('./models/user.js');
var cfg = require("./config.js");
var errorCodes= require('./errorCodes.js');
var jwt = require("jwt-simple");
var toJSON = require( 'utils-error-to-json' );
var moment = require('moment');//gestione date e tempo
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

module.exports = function(req, res, next) {

  return {
    /**
     * Method for authentication of simple users
     */
      authenticate: function(req, res, next) {
        try{
          //Recover of token and decoding
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, cfg.jwtSecret);//esiste libreria per farlo in modo asincrono
          //Check if the token is expired
          if(moment().unix()<payload.expr){
            //Token not expired
            //Take information of the user from the db
            User.findOne({_id: payload.id}, function(err, user) {
              if (err) {
                res.status(401).json({
                  success: false,
                  error:toJSON(err),
                  code:errorCodes.ERR_USER_NOT_FOUND,
                  message: 'User with id in the token not found'
                });
              }
              //User exist, return of the user id
              if (user) {
                req.userId = payload.id;
                next();
              } else {
                res.status(401).json({
                  success: false,
                  code:errorCodes.ERR_API_UNAUTHORIZED,
                  message: 'User unauthorized, it\' isn\'t an user'
                });
              }
            });
          }else{
            res.status(498).json({
              success: false,
              code:errorCodes.ERR_TOKEN_EXPIRED,
              message: 'Token expired'
            });
          }
        }catch(err){
          res.status(401).json({
            success: false,
            error:toJSON(err),
            code:errorCodes.ERR_JWT_TOKEN_NOT_FOUND,
            message: 'No JWT token in the header'
          });
        }
      },
      authenticateAdmin: function(req, res, next) {
        try{
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, cfg.jwtSecret);//esiste libreria per farlo in modo asincrono
        if(moment().unix()<payload.exp){
          User.findOne({_id: payload.id}, function(err, user) {
            if (err) {
              res.status(401).json({
                success: false,
                error:toJSON(err),
                code:errorCodes.ERR_USER_NOT_FOUND,
                message: 'Admin user with id in the token not found'
              });
            }
            if (user && user.isAdmin) {
              req.userId = payload.id;
              next();
            } else {
                res.status(401).json({
                  success: false,
                  code:errorCodes.ERR_API_UNAUTHORIZED,
                  message: 'User unauthorized, it\' isn\'t an admin'
                });
              }
            });
          }else{
            res.status(498).json({
              success: false,
              code:errorCodes.ERR_TOKEN_EXPIRED,
              message: 'Token expired'
            });
          }
        }catch(err){
          res.status(401).json({
            success: false,
            error:toJSON(err),
            code:errorCodes.ERR_JWT_TOKEN_NOT_FOUND,
            message: 'No JWT token in the header'
          });
        }
      }
  };
};
