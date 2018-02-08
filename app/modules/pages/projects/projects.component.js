angular.module('mealApp').component('projects', {
  templateUrl: 'modules/pages/projects/projects.template.html',
  controller: ['$scope', '$location','UserService', 'moment',
                  function($scope, $location, UserService, moment) {
                    UserService.cachedProject=null;
                    UserService.getProjects($location.search().onlyMy)//prendo lista progetti
                    .then(function(response) {
                      $scope.projectsList = response.data.projects;
                    });
                    UserService.getUser().then(function(response) {
                      $scope.user = response.data.user;
                    });

                    $scope.enumProjects = UserService.getEnumProjects();
              }]
});
