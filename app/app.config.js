var mealApp = angular.module('mealApp', ['ngRoute', 'ngSanitize', 'MassAutoComplete', 'angularMoment','ngFileUpload', 'textAngular', 'timer', 'angular.filter']);

mealApp.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/',{
        template: '<home></home>'
      }).
      when('/profile',{
          template: '<profile></profile>',
          access: {onlyUser: true}
        }).
      when('/register',{
          template: '<register></register>'
        }).
      when('/login',{
          template: '<login></login>'
        }).
      when('/newProject',{
            template: '<create-project></create-project>',
            access: {onlyUser: true}
          }).
      when('/projects',{
            template: '<projects></projects>'
          }).
      when('/projectDetails',{
            template: '<project-details></project-details>',
            access: {onlyUser: true}//penso che dei progetti sulla home page basta la versione short
          }).
      when('/projectManagement',{
            template: '<project-management></project-management>',
            access: {onlyUser: true}
          }).
      when('/show/:id/:username',{
            template: '<show></show>',
            access: {onlyUser: true}
          }).
      when('/admin',{
            template: '<admin></admin>',
            access: {onlyAdmin: true}
          }).
      otherwise('/profile');
  }
]);

mealApp.run(function ($rootScope, $location, $route, UserService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      
      UserService.getUserStatus()
      .then(function(){
        if (!angular.isUndefined(next.access) && next.access.onlyUser && !UserService.isLoggedIn()) { //check logged
          $location.path('/login');
          $route.reload();
        }
      });

      UserService.getAdminStatus()
      .then(function(){
        if (!angular.isUndefined(next.access) && next.access.onlyAdmin && !UserService.isAdmin()) { //check admin
          $location.path('/profile');
          $route.reload();
        }
      });
  });
});

angular.module('mealApp').controller('loggedController',
['$scope', 'UserService', '$location', '$rootScope',
function ($scope, UserService, $location, $rootScope) {

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  };

  $scope.isAdmin = function() {
    return UserService.isAdmin();
  };

  $scope.logout = function () {
    // call logout from service
    UserService.logout()
      .then(function () {
        $location.url('/login');
      });
  }

  $scope.deleteNotifications = function () {
    //delete all notifications
    UserService.deleteNotifications()
      .then(function () {
        $scope.notifications = [];
      });
  }

  $rootScope.$on('newNotifications', function() {//richiamabile dal controller del login
    UserService.getUser()//prendo le notifiche
      .then(function (response) {
        $scope.notifications = response.data.user.notifications;
      });
  });

  $rootScope.$emit('newNotifications');

  $scope.extractConvert = function(frase) {//trovo e traduco lo status del progetto
    pattern = "@(.*)@";
    if (frase.match(pattern)) {
      enumProjects = UserService.getEnumProjects();
      status = frase.match(pattern)[0];
      return frase.replace(status, '"' + enumProjects[status.replace(/@/g, '')] + '"');
    } else {
      return frase;
    }
  }

}]);