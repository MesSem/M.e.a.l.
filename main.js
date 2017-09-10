/*
var mongodb = require("mongodb");
//var dbUrl = require("./config/db.js");
var ObjectID = mongodb.ObjectID;

//var STUDENTS_COLLECTION = "students";

*/
// IN main_js_CODICE_DA_ESEMPI Ho messo il codice che ho tolto da qui perchè node mi dava errrore e non eseguiva il server
var debug = require('debug')('passport-mongo');
var app = require('./app');


app.set('port', process.env.PORT || 8080);


var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
