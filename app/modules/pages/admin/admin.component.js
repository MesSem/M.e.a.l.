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

                        UserService.usersList()//prendo lista utenti
                        .then(function(response) {
                            $scope.users = response.data.users;
                        });

                        $scope.changeStatus = function (project, newStatus) {//cambio stato progetto
                            $scope.projectsError = $scope.projectsSuccess = false;
                            UserService.changeProjectStatus(project._id, newStatus)
                            .then(function(response) {
                                project.status.value = newStatus;
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

                        $scope.closeAndReturn = function (project) {//forza chiusura progetto
                            //cambiare stato!!!!!!
                            $scope.projectsError = $scope.projectsSuccess = false;
                            UserService.closeAndReturn(project._id)
                            .then(function(response) {
                                project.status.value = 'FORCED_CLOSING';
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

                    $scope.enumProjects = UserService.getEnumProjects();

                    $scope.orderStatus = function(user) {//precedenza a utenti in attesa o non verificati
                        if (user.verified == 'WAITING')
                            return 1;
                        else if (user.verified == 'UNVERIFIED')
                            return 2;
                        else
                            return 3;
                     };

                    $scope.openID = function (id, filename) {
                        var redirectWindow = window.open('uploads/' + id + '/ID/' + filename, '_blank');
                        redirectWindow.location;
                    };

                    $scope.changeVerified = function(user, status) {

                        UserService.changeVerified(user, status)
                        .then(function(response) {
                            //console.log(response.data.user);
                            user.verified = status;
                            $scope.projectsSuccess = true;
                            $scope.projectsSuccessMessage = response.data.status;
                        })
                        .catch(function(error) {
                            $scope.projectsError = true;
                            $scope.projectsErrorMessage = error.data.message;
                        });
                    }
                      
                }]
  });