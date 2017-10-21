angular.module('mealApp').component('login', {
  templateUrl: 'modules/components/login/login.template.html',
  controller: ['$scope', '$location', 'UserService',
              function ($scope, $location, UserService) {

                $scope.loginForm = {};
                $scope.loginForm.sessionOpen = true;

                $scope.login = function () {

                  // initial values
                  $scope.error = false;
                  $scope.disabled = true;

                  // call login from service
                  UserService.login($scope.loginForm.username, $scope.loginForm.password, $scope.loginForm.sessionOpen)
                    // handle success
                    .then(function () {
                      UserService.getUser(true).then(function(response) {
                        $scope.user = response.data.user;
                      });
                      $location.path('/');
                      $scope.disabled = false;
                      $scope.loginForm = {};
                    })
                    // handle error
                    .catch(function () {
                      $scope.error = true;
                      $scope.errorMessage = "Invalid username and/or password";
                      $scope.disabled = false;
                      $scope.loginForm = {};
                    });

                };

            }]
});
