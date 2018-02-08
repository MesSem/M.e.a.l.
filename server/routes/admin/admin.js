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
adminRoutes.post('/changeProjectStatus', function(req, res) {//findByIdAndUpdate per far tornare nome progetto

  var projectId = req.body.projectId;
  var newStatus = req.body.newStatus;

  Project.findByIdAndUpdate({_id : projectId}, {status:{value:newStatus}}, function(err, project){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating project status', err, 500);
    }

    res.status(200).json({
      status: 'Update successful!'
    });
    utils.createNotification(project.owner, 'Il tuo progetto "' + project.name + '" è stato impostato come @' + newStatus + '@', 'YOUR_PROJECT_PUBLIC');
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
      utils.createNotification(project.owner, 'Il tuo progetto "' + project.name + '" non è più pubblico','YOUR_PROJECT_PUBLIC');
  });

});

/**
 * @api {post} /api/admin/closeAndReturn close a project and return the money
 * @apiName CloseAndReturn
 * @apiGroup Admin
 *
 * @apiSuccess {String} status Message if the closing it's ok
 *
 */
adminRoutes.post('/closeAndReturn', function(req, res) {

  var projectId = req.body.projectId;

  Project.find({_id: projectId}, function (err, project) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting the project', err, 500);
    }
    try {
      utils.forceClosing(projectId);
    } catch(err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error closing the project and returning money', err, 500);
    }

    res.status(200).json({
      status: 'Closing successful!'
    });
    utils.createNotification(project.owner, 'Il tuo progetto "' + project.name + '" è stato chiuso e i soldi rimborsati', 'YOUR_PROJECT_FORCED');
  })

});

/**
 * @api {get} /api/admin/adminList List of all the admins
 * @apiName AdminList
 * @apiGroup Admin
 *
 * @apiSuccess {[Admins]} list of all the admins
 *
 */
adminRoutes.get('/adminList', function(req, res) {
  User.find({isAdmin: true}, '_id, username', function (err, result) {
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error getting admins list', err, 500);
    }
    return res.status(200).json({
      admins: result
    });
  })
});

/**
 * @api {get} /api/admin/adminList List of all the admins
 * @apiName AdminList
 * @apiGroup Admin
 *
 * @apiSuccess {[Admins]} list of all the admins
 *
 */
adminRoutes.post('/newAdmin', function(req, res) {
  var username = req.body.username;

  User.findOneAndUpdate({username : username}, {"$set" : {isAdmin: true}}, function(err, user){
    if (err) {
      return errorCodes.sendError(res, errorCodes.ERR_DATABASE_OPERATION, 'Error updating admins status', err, 500);
    }
    res.status(200).json({
      status: 'New admin setting successful!'
    });
    utils.createNotification(user._id, 'Complimenti, ora sei un admin!', 'GENERAL');
  })
});

module.exports = adminRoutes;