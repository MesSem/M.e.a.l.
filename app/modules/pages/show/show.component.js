angular.module('mealApp').component('show', {
    templateUrl: 'modules/pages/show/show.template.html',
    controller: ['$scope', 'UserService', '$routeParams',
                    function($scope, UserService, $routeParams) {
                        var id = $routeParams.id;
                        UserService.getPublicUser(id)//prendo lista progetti
                            .then(function(response) {
                                $scope.userInfo = response.data.user;
                                $scope.projects = response.data.projects;
                                $scope.count = $scope.projects.length;
                            })
                            .catch(function (error) {
                                $scope.error = true;
                                $scope.errorMessage = error.data.message;
                                //$scope.disabled = false;
                                //$scope.registerForm = {};
                            });
                }]
});