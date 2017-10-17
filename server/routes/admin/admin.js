// =======================
// ADMIN ROUTES
// =======================

var express = require('express');
var router = express.Router();

var errorCodes= require('../../errorCodes.js');
var utils= require('../../utils.js');

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
 * @api {get} /api/admin/list List of all the projects
 * @apiName ListAllProjects
 * @apiGroup Admin
 *
 * @apiSuccess {[Project]} list of all the projects
 *
 */
adminRoutes.get('/listAllProjects', function(req, res) {
  Project.find({}, function (err, result) {
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
 * @api {post} /api/admin/changeProjectStatus change the status of a project
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

/**
 * @api {post} /api/admin/setPublic change public status of a project
 * @apiName SetPublic
 * @apiGroup Admin
 *
 * @apiSuccess {String} status Message if the editing it's ok
 *
 */
adminRoutes.post('/setPublic', function(req, res) {
  
    var projectId = req.body.projectId;
    var newStatus = req.body.newStatus;
  
    Project.findByIdAndUpdate({_id : projectId}, {isExample:newStatus}, function(err, project){//findByIdAndUpdate per far tornare nome progetto
      if (err) {
        return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating project public status', err, 500);
      }
  
      res.status(200).json({
        status: 'Update successful!'
      });
      if (newStatus)//controllo per testo notifica
        utils.createNotification(project.owner, 'Il tuo progetto "' + project.name + '" è ora pubblico!','YOUR_PROJECT_PUBLIC');
      else
        utils.createNotification(project.owner, 'Il tuo progetto "' + project.name + '" non è più','YOUR_PROJECT_PUBLIC');
    });
  
  });

module.exports = adminRoutes;