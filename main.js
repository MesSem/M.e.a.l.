var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
//var dbUrl = require("./config/db.js");
var ObjectID = mongodb.ObjectID;

//var STUDENTS_COLLECTION = "students";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/app/";
app.use(express.static(distDir));

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

/*
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

var MONGODB_URI = process.env.MONGODB_URI || dbUrl.url;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});
*/
/*
// STUDENTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}
*/
/*  "/api/v1.0/students"
 *    GET: finds all students
 *    POST: creates a new student
 */
/*
app.get("/api/v1.0/students", function (req, res) {
  console.log("GET students");
  db.collection(STUDENTS_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get students.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/v1.0/students", function (req, res) {
  console.log("POST students");
  var newStudent = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
    return;
  }

  db.collection(STUDENTS_COLLECTION).insertOne(newStudent, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new to do.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});
*/
/*  "/api/v1.0/students/:id"
 *    GET: find student by id
 *    PUT: update student by id
 *    DELETE: deletes student by id
 */
/*
app.get("/api/v1.0/students/:id", function (req, res) {
  console.log("GET student");
  db.collection(STUDENTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get student");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/v1.0/students/:id", function (req, res) {
  console.log("PUT student");
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(STUDENTS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update student");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/v1.0/students/:id", function (req, res) {
  console.log("DELETE student");
  db.collection(STUDENTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete student");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
*/
