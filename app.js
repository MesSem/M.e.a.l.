// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var auth = require("./server/auth.js")();
var utils = require("./server/utils.js");
var config = require("./server/config.js");
var moment = require('moment');//gestione date e tempo

try {//se il file per le key api esiste, uso quello
    var keys = require('./keys.js');
} catch (ex) {
    console.log("File keys.js non trovato. Ricerca nelle variabili di sessione...");

    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
        console.log('Una o più variabili mancanti! Ricordati di impostarle!');
        throw Error('Missing api key');
    }
    else {
        var keys = {};
        keys.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
        keys.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
    }
}

mongoose.Promise = global.Promise;
// mongoose
if (process.env.NODE_ENV == 'production') {//imposto in produzione se avvio con 'npm start'
  console.log('production');
  mongoose.connect('mongodb://admin:secret@ds235388.mlab.com:35388/meal', { useMongoClient: true });
} else {
  console.log('development');
  mongoose.connect('mongodb://localhost/meal', { useMongoClient: true });
}

// user schema/model
var User = require('./server/models/user.js');

// create instance of express
var app = express();

//define distdir
var distDir = __dirname + "/app/";
app.use(express.static(distDir));

// define middleware
app.use(express.static(path.join(__dirname, '../modules')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

/*  FACEBOOK authentication  */

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields : ["id", "birthday", "email", "first_name", "gender", "last_name"]
  },
  // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser= new User();
                    console.log(profile);

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.name  = profile.name.givenName;
                    newUser.surname=profile.name.familyName;
                    newUser.username=profile.id;
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.bornDate=Date.now();

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        utils.createNotification(newUser._id, "Si è verificato un problema con Facebook. La preghiamo di inserire la corretta data di nascita sul proprio profilo");
                        return done(null, newUser);
                    });
                }

            });
        });

    }
));

/* End FACEBOOK authentication*/

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: config.timeCallMethodPeriodically,
  onTick:function() {
    /* Runs every weekday (Sunday through Saturday) at 16:10:00 AM. It does not run on Saturday or Sunday. */
    utils.updateActualMoney();
    utils.closeProjectAll();
    utils.returnMoneyAll();
    //PUT HERE METHODS TO CALL PERIODICALY
  },
  start: true,
  timeZone: 'Europe/Rome'
});
job.start();
utils.checkMEALAccountOrCreate();

// =======================
// API ROUTES
// =======================
var apiRoutes = require('./server/routes/api/api');
app.use('/api', apiRoutes);


// =======================
// USER ROUTES
// =======================
userRoutes = require('./server/routes/user/user');
app.use('/api/user',auth.authenticate, userRoutes);


// =======================
// ADMIN ROUTES
// =======================
var adminRoutes = require('./server/routes/admin/admin');
app.use('/api/admin', auth.authenticateAdmin,adminRoutes);
/*
app.get('/images/',auth.authenticate, function (req, res) {
    // res.sendFile(filepath);
});*/

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/app', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(req, res);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
