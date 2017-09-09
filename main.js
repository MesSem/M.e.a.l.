/*var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
//var dbUrl = require("./config/db.js");
var ObjectID = mongodb.ObjectID;

//var STUDENTS_COLLECTION = "students";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/src/app/";
app.use(express.static(distDir));

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
*/
// IN main_js_CODICE_DA_ESEMPI Ho messo il codice che ho tolto da qui perchè node mi dava errrore e non eseguiva il server
var debug = require('debug')('passport-mongo');
var app = require('./app');


app.set('port', process.env.PORT || 8080);


var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});