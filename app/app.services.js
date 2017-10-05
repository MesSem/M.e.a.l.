angular.module('mealApp').factory('UserService',
['$q', '$timeout', '$http',
function ($q, $timeout, $http) {

  try{
    $http.defaults.headers.common.Authorization = 'JWT ' +window.sessionStorage.accessToken;
  }catch(err){
    console.log("jwt not found");
  }

  // create user variable
  var user = null;

  // return available functions for use in the controllers
  return ({
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
    changePw: changePw
  });

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
  function getProjects() {
    if(!cachedProjects) cachedProjects = $http.get('/api/user/listProjects');
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

}]);