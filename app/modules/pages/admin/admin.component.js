angular.module('mealApp').component('admin', {
    templateUrl: 'modules/pages/admin/admin.template.html',
    controller: ['$scope', '$location','UserService', 'moment',
                    function($scope, $location, UserService, moment) {
                        UserService.adminList()
                        .then(function(response) {
                            $scope.admins = response.data.admins;
                        })

                      UserService.listAllProjects()//prendo lista progetti
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

                        $scope.accepted = projects.filter(function(item) {//da controllare
                            return item.status.value === 'ACCEPTED';
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

                    $scope.setPublic = function (project) {

                        $scope.projectsError = $scope.projectsSuccess = false;
                        UserService.setPublic(project._id, !project.isExample)
                        .then(function(response) {
                            project.isExample = !project.isExample;
                            $scope.projectsSuccess = true;
                            $scope.projectsSuccessMessage = response.data.status;
                        })
                        .catch(function(error) {
                            $scope.projectsError = true;
                            $scope.projectsErrorMessage = error.data.message;
                        });

                    };

                    $scope.closeAndReturn = function (projectId) {
                        //cambiare stato!!!!!!
                        $scope.projectsError = $scope.projectsSuccess = false;
                        UserService.closeAndReturn(projectId)
                        .then(function(response) {
                            $scope.projectsSuccess = true;
                            $scope.projectsSuccessMessage = response.data.status;
                        })
                        .catch(function(error) {
                            $scope.projectsError = true;
                            $scope.projectsErrorMessage = error.data.message;
                        });

                    };

                    $scope.newAdmin = function () {
                        $scope.projectsError = $scope.projectsSuccess = false;
                        UserService.newAdmin($scope.newAdminName)
                        .then(function(response) {
                            window.location.reload();
                            //$scope.projectsSuccess = true;
                            //$scope.projectsSuccessMessage = response.data.status;
                        })
                        .catch(function(error) {
                            $scope.projectsError = true;
                            $scope.projectsErrorMessage = error.data.message;
                        });

                    };

                    

                    
                      
                }]
  });