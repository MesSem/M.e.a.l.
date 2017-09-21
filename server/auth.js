var passportJWT = require("passport-jwt");
var User = require('./models/user.js');
var cfg = require("./config.js");
var jwt = require("jwt-simple");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')
};
/*
var auth;
auth.authenticate=function(req, res, next){
  var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    req.userId = payload.sub;
    next();
}*/
module.exports = function(req, res, next) {

  try{
  var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, cfg.jwtSecret);
    User.findOne({_id: payload.id}, function(err, user) {
      console.log(payload.id);
      if (err) {
        res.send("error");
          //return done(err, false);
      }
      if (user) {
        req.userId = payload.id;
        next();
        //  done(null, {
          //    user: user.id
          //});
      } else {
        res.send("error");
        //  done(null, false);
          // or you could create a new account
          // return done(new Error("User not found"), null);
      }
    });

  }
  catch(err){
    res.send("error");
    //return next('route');
  }

};
