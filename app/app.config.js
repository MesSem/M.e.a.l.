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

mealApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (!angular.isUndefined(next.access) && next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});