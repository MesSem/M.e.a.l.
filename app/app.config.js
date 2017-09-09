var mealApp = angular.module('mealApp', ['ngRoute']);

mealApp.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/',{
        template: '<home></home>'
      }).
      when('/profile',{
          template: '<profile></profile>'
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