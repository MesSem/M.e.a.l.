angular.module('mealApp').component('projectDetails', {
  templateUrl: 'modules/pages/project-details/project-details.template.html',
  controller: ['$scope', '$location','UserService', 'moment',
                  function($scope,$location, UserService, moment) {
                    UserService.getProject($location.search().id)
                    .then(function(response) {
                      $scope.project = response.data.project;
                      });
              }]
});
