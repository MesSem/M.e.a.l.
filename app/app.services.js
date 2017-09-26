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
    createProject:createProject
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

  function login(username, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/login',
      {username: username, password: password})
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          user = true;
          if (success.data.token) {
               // store username and token in local storage to keep user logged in between page refreshes
               //$localStorage.currentUser = { username: username, token: response.token }; può essere utile???

               // add jwt token to auth header for all requests made by the $http service
               window.sessionStorage.accessToken = success.data.token;
               $http.defaults.headers.common.Authorization = 'JWT ' + success.data.token;
             }
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .catch(function (error) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/api/user/logout')
      // handle success
      .then(function (success) {
        user = false;
        window.sessionStorage.accessToken=null;
        deferred.resolve();
      })
      // handle error
      .catch(function (error) {
        user = false;
        window.sessionStorage.accessToken=null;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function register(form) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/register/', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  var cachedUser = null;
  function getUser() {
    if(!cachedUser) cachedUser = $http.get('/api/user/user');
    return cachedUser;
  }

  function updateUser(form) {
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/user', form)
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

  function addCard(form) {
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/card', form)
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

  function deleteCard(cardId, userId) {
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.delete('/api/user/card?user=' + userId + '&card=' + cardId)
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

  var cachedUserList = null;
  function getUserList() {
    if(!cachedUserList) cachedUserList = $http.get('/api/user/list');
    return cachedUserList;
  }

  function sendMoney(form) {
    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/transaction', form)
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

//NON UTILIZZATA
  function createProject(form) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/user/project', form)
      // handle success
      .then(function (success) {
        if(success.status === 200 && success.data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .catch(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }


  var cachedTransactions = null;
  function getTransactions() {
    if(!cachedTransactions) cachedTransactions = $http.get('/api/user/transaction');
    return cachedTransactions;
  }

}]);
