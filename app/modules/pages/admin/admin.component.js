angular.module('mealApp').component('admin', {
    templateUrl: 'modules/pages/admin/admin.template.html',
    controller: ['$scope', '$location','UserService',
                    function($scope, $location, UserService) {
                      //UserService.cachedProject=null;
                      UserService.listNotAcceptedProjects()//prendo lista progetti
                      .then(function(response) {
                        projects = response.data.projects;

                        $scope.waiting = projects.filter(function(item) {//da controllare
                            return item.status.value === 'TO_CHECK';
                        });

                        $scope.rejected = projects.filter(function(item) {//da controllare
                            return item.status.value === 'NOT_ACCEPTED';
                        });

                        $scope.closed = projects.filter(function(item) {//da controllare
                            return item.status.value === 'CLOSED';
                        });

                        $scope.returned = projects.filter(function(item) {//da controllare
                            return item.status.value === 'CLOSED_&_RESTITUTED';
                        });

                      });

                      $scope.changeStatus = function (projectId, newStatus) {
                        $scope.projectsError = $scope.projectsSuccess = false;
                        UserService.changeProjectStatus(projectId, newStatus)
                        .then(function(response) {
                            $scope.projectsSuccess = true;
                            $scope.projectsSuccessMessage = response.data.status;
                        })
                        .catch(function(error) {
                            $scope.projectsError = true;
                            $scope.projectsErrorMessage = error.data.message;
                        });
                    };


                      
                }]
  });