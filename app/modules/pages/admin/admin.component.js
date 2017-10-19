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
                            $scope.projects = response.data.projects;
                        });

                        $scope.changeStatus = function (projectId, newStatus) {//cambio stato progetto
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

                        $scope.setPublic = function (project) {//cambio stato pubblico progetto

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

                        $scope.closeAndReturn = function (projectId) {//forza chiusura progetto
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

                        $scope.newAdmin = function () {//abilita utente amministratore
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

                        
                        $scope.today = new Date();
                        $scope.today = $scope.today.toISOString()

                        $scope.filterStatus = function (status) {
                            if ($scope.status == status)
                                $scope.status = null;
                            else
                                $scope.status = status;
                        }
                    
                      
                }]
  });