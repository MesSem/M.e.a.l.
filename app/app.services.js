angular.module('mealApp').factory('UserService',
['$q', '$timeout', '$http',
function ($q, $timeout, $http) {

  try{
    $http.defaults.headers.common.Authorization = 'JWT ' +window.sessionStorage.accessToken;
  }catch(err){
    console.log("jwt not found");
  }

  // create user variable
  var user = admin = verified = null;

  // return available functions for use in the controllers
  return ({
    getEnumProjects:getEnumProjects,
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    getUser: getUser,
    updateUser: updateUser,
    addCard: addCard,
    deleteCard: deleteCard,
    getUserList: getUserList,
    sendMoney: sendMoney,
    getTransactions: getTransactions,
    getProjects: getProjects,
    createProject:createProject,
    getProject: getProject,
    createLoan:createLoan,
    changePw: changePw,
    updateProject:updateProject,
    getLoansOfProject:getLoansOfProject,
    getPublicUser: getPublicUser,
    returnMoney:returnMoney,
    getDoneLoans:getDoneLoans,
    deleteNotifications:deleteNotifications,
    isAdmin:isAdmin,
    getAdminStatus:getAdminStatus,
    listAllProjects:listAllProjects,
    changeProjectStatus:changeProjectStatus,
    setPublic:setPublic,
    closeAndReturn:closeAndReturn,
    adminList:adminList,
    newAdmin:newAdmin,
    newNotification:newNotification,
    createComment:createComment,
    uploadIdentity:uploadIdentity,
    usersList:usersList,
    changeVerified:changeVerified,
    getVerifiedStatus:getVerifiedStatus,
    isVerified:isVerified
  });

  function getEnumProjects() {//traduco da enum in italiano
    return {ACCEPTED : 'In corso', TO_CHECK : 'In attesa', NOT_ACCEPTED : 'Respinto', CLOSED : 'Chiuso', 'CLOSED_&_RESTITUTED' : 'Chiuso e restituito', FORCED_CLOSING : 'Chiusura forzata'};
  }

  function isLoggedIn() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  function getUserStatus() {
    return $http.get('/api/user/status')
    // handle success
    .then(function (success) {
      if(success.data.status){
        user = true;
      } else {
        user = false;
      }
    })
    // handle error
    .catch(function (error) {
      user = false;
    });
  }

  function login(username, password, sessionOpen) {
    cachedUser = cachedUserList = cachedTransactions = cachedProjects = cachedLoansDone = null;//reset cache
    return $http.post('/api/login', {username: username, password: password, sessionOpen:sessionOpen});
  }

  function logout() {
    return $http.get('/api/user/logout');
  }

  function register(form) {
    return $http.post('/api/register/', form);
  }

  var cachedUser = null;
  function getUser() {
    if(!cachedUser) cachedUser = $http.get('/api/user/user');
    return cachedUser;
  }

  function updateUser(form) {
    return $http.post('/api/user/user', form);
  }

  function addCard(form) {
    return $http.post('/api/user/card', form);
  }

  function deleteCard(cardId, userId) {
    return $http.delete('/api/user/card?user=' + userId + '&card=' + cardId);
  }

  var cachedUserList = null;
  function getUserList() {
    if(!cachedUserList) cachedUserList = $http.get('/api/user/list');
    return cachedUserList;
  }

  function sendMoney(form) {
    return $http.post('/api/user/transaction', form);
  }

//NON UTILIZZATA
  function createProject(form) {
    return $http.post('/api/user/project', form);
  }


  var cachedTransactions = null;
  function getTransactions() {
    if(!cachedTransactions) cachedTransactions = $http.get('/api/user/transaction');
    return cachedTransactions;
  }

  var cachedProjects = null;
  function getProjects(onlyMy) {
    query='/api/user/listProjects';
    if(onlyMy){
      query=query+'?onlyMy=true';
    }
    cachedProjects = $http.get(query);
    return cachedProjects;
  }

  function getProject(id) {
    Project = $http.get('/api/user/detailsProject?id='+id);
    return Project;
  }


  function createLoan(form) {
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/loan', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function changePw(oldPw, newPw) {
    return $http.post('/api/user/changePw', {oldPw, newPw});
  }

  function updateProject(form) {
    return $http.post('/api/user/editProject', form);
  }

  function getLoansOfProject(idProject){
    return $http.get('/api/user/listLoanForProject?idP='+idProject);
  }

  function getPublicUser(id) {
    return $http.post('/api/user/publicUser', {id});
  }

  function returnMoney(idProject) {
    return $http.get('/api/user/returnMoney?idP='+idProject);
  }

  var cachedLoansDone = null;
  function getDoneLoans() {
    if(!cachedLoansDone) cachedLoansDone = $http.get('/api/user/listLoans');
    return cachedLoansDone;
  }

  function deleteNotifications(idProject) {
    return $http.delete('/api/user/deleteNotifications');
  }

  function isAdmin() {
    if(admin) {
      return true;
    } else {
      return false;
    }
  }

  function getAdminStatus() {
    return $http.get('/api/admin/status')
    // handle success
    .then(function (success) {
      if(success.data.status){
        admin = true;
      } else {
        admin = false;
      }
    })
    // handle error
    .catch(function (error) {
      admin = false;
    });
  }

  function listAllProjects() {
    return $http.get('/api/admin/listAllProjects');
  }

  function changeProjectStatus(projectId, newStatus) {
    return $http.post('/api/admin/changeProjectStatus', {projectId, newStatus});
  }

  function setPublic(projectId, newStatus) {
    return $http.post('/api/admin/setPublic', {projectId, newStatus});
  }

  function closeAndReturn(projectId) {
    return $http.post('/api/admin/closeAndReturn', {projectId});
  }

  function adminList() {
    return $http.get('/api/admin/adminList');
  }

  function newAdmin(username) {
    return $http.post('/api/admin/newAdmin', {username});
  }

  function newNotification(recipient, message) {
    return $http.post('/api/user/newNotification', {recipient, message});
  }

  function createComment(form) {
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/newComment', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        deferred.reject(error);
      });

    // return promise object
    return deferred.promise;
  }

  function uploadIdentity(uploadDoc) {
    return $http.post('/api/user/uploadDoc', {uploadDoc});
  }

  function usersList() {
    return $http.get('/api/admin/usersList');
  }

  function changeVerified(user, status) {
    return $http.post('/api/admin/changeVerified', {user, status});
  }

  function getVerifiedStatus() {
    getUser()
    .then(function (success) {
      verUser = success.data.user;

      if (verUser.verified === 'VERIFIED')
        verified = true
      else
        verified = false;
    });
  }

  function isVerified() {
    if(verified) {
      return true;
    } else {
      return false;
    }
  }

}]);
