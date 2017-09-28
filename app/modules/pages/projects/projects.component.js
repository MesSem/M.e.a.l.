angular.module('mealApp').component('projects', {
  templateUrl: 'modules/pages/projects/projects.template.html',
  controller: ['$scope', 'UserService', 'moment',
                  function($scope, UserService, moment) {
                    UserService.getProjects()//prendo lista progetti
                    .then(function(response) {
                      $scope.projectsList = response.data.projects;
                      });
              }]
});
