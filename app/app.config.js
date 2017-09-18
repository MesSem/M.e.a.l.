var mealApp = angular.module('mealApp', ['ngRoute']);

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
        });
        /*
      otherwise('/students');*/
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
['$scope', '$location', 'UserService',
function ($scope, $location, UserService) {

  $scope.isLoggedIn = function() {
    return UserService.isLoggedIn();
  };

  $scope.logout = function () {
    // call logout from service
    UserService.logout()
      .then(function () {
        $location.path('/login');
      });
  }

}]);