angular.
  module('mealApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/students', {
          template: '<student-list></student-list>'
        });/*.
        when('/students/:studentId', {
          template: '<student-detail></student-detail>'
        }).
        when('/add/students', {
          template: '<add-student></add-student>'
        }).
        when('/edit/students/:studentId', {
          template: '<edit-student></edit-student>'
        }).
        otherwise('/students');*/
    }
]);
