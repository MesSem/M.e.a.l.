angular.module('mealApp').component('admin', {
    templateUrl: 'modules/pages/admin/admin.template.html',
    controller: ['$scope', '$location','UserService',
                    function($scope, $location, UserService) {
                      //UserService.cachedProject=null;
                      UserService.listWaitingProjects()//prendo lista progetti
                      .then(function(response) {
                        $scope.projectsList = response.data.projects;
                      });
                      
                }]
  });