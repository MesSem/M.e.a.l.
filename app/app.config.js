angular
  .module('mealApp', ['ngRoute'])
  .config(function ($routeProvider) {
      //$locationProvider.hashPrefix('!');

      $routeProvider.when('/',
          {
            templateUrl: "modules/pages/home/home.template.html"
          }
        )
        .when('/profile',
          {
            templateUrl: "modules/pages/profile/profile.template.html"
          }
        )
        .when('/register',
          {
            templateUrl: "modules/pages/register/register.template.html"
          }
        );
        /*.when('/students',
          {
            template: '<student-list></student-list>'
          }
        )*/
        
        /*.
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
  );
