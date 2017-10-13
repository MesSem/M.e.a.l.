var mealApp = angular.module('mealApp', ['ngRoute', 'ngSanitize', 'MassAutoComplete', 'angularMoment','ngFileUpload', 'textAngular', 'timer']);

mealApp.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/',{
        template: '<home></home>'
      }).
      when('/profile',{
          template: '<profile></profile>',
          access: {restricted: true}
        }).
      when('/register',{
          template: '<register></register>'
        }).
      when('/login',{
          template: '<login></login>'
        }).
      when('/newProject',{
            template: '<create-project></create-project>'
          }).
      when('/projects',{
            template: '<projects></projects>'
          }).
      when('/projectDetails',{
            template: '<project-details></project-details>',
            access: {restricted: true}//penso che dei progetti sulla home page basta la versione short
          }).
      when('/projectManagement',{
            template: '<project-management></project-management>',
            access: {restricted: true}
          }).
      when('/show/:id/:username',{
            template: '<show></show>',
            access: {restricted: true}
          }).
      otherwise('/profile');
  }
]);

mealApp.run(function ($rootScope, $location, $route, UserService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      UserService.getUserStatus()
      .then(function(){
        if (!angular.isUndefined(next.access) && next.access.restricted && !UserService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});

angular.module('mealApp').controller('loggedController',
['$scope', '$window', 'UserService',
function ($scope, $window, UserService) {

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  };

  $scope.logout = function () {
    // call logout from service
    UserService.logout()
      .then(function () {
        $window.location.reload();
      });
  }

  $scope.deleteNotifications = function () {
    //delete all notifications
    UserService.deleteNotifications()
      .then(function () {
        $scope.notifications = [];
      });
  }

  UserService.getUser()
    .then(function (response) {
      userInfo = response;
      //console.log(userInfo);
      $scope.notifications = userInfo.data.user.notifications;
      //if (notifications.length > 0)
        //console.log(notifications);
    });
  

}]);
