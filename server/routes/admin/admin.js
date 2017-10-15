// =======================
// ADMIN ROUTES
// =======================

var express = require('express');
var router = express.Router();

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');
var Project= require('../../models/project.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();

/**
 * Api di prova per fare testing
 */
adminRoutes.get('/prova', function(req, res) {
  res.status(200).json({
    message: "Complimenti, puoi accedere alle api admin"
  });
});

/**
 * @api {get} /api/admin/status Information of the user status
 * @apiName Status
 * @apiGroup Admin
 *
 * @apiSuccess {Boolean} logged True if the user is logged, false elsewhere
 */
adminRoutes.get('/status', function(req, res) {
  res.status(200).json({
    status: true
  });
});

/**
 * @api {get} /api/admin/list List of all the unaccepted projects
 * @apiName ListNotAcceptedProjects
 * @apiGroup Admin
 *
 * @apiSuccess {[Project]} list of unaccepted projects
 *
 */
adminRoutes.get('/listNotAcceptedProjects', function(req, res) {
  Project.find({"status.value" : {'$ne': 'ACCEPTED'}}, function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting projects list', err, 500);
    }
    return res.status(200).json({
      projects: result
    });
  })
  .populate('owner',{username:'username', _id:'id'});

});

/**
 * @api {get} /api/admin/changeProjectStatus change the status of a project
 * @apiName ChangeProjectStatus
 * @apiGroup Admin
 *
 * @apiSuccess {String} status Message if the editing it's ok
 *
 */
adminRoutes.post('/changeProjectStatus', function(req, res) {

  var projectId = req.body.projectId;
  var newStatus = req.body.newStatus;

  Project.update({_id : projectId}, {status:{value:newStatus}}, function(err){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating project status', err, 500);
    }

    res.status(200).json({
      status: 'Update successful!'
    });
  });

});

module.exports = adminRoutes;