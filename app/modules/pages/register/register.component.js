angular.module('mealApp').component('register', {
  templateUrl: 'modules/pages/register/register.template.html',
  controller: ['$scope', '$location', 'UserService',
              function ($scope, $location, UserService) {

                $scope.register = function () {

                  // initial values
                  $scope.error = false;
                  $scope.disabled = true;

                  if ($scope.registerForm.password != $scope.repeat_password) {
                    $scope.error = true;
                    $scope.errorMessage = "Password is not the same in the check input!";
                  }
                  else {
                    // call register from service
                    UserService.register($scope.registerForm)
                      // handle success
                      .then(function () {
                        $location.path('/login');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                      })
                      // handle error
                      .catch(function (error) {
                        $scope.error = true;
                        $scope.errorMessage = error.data.message;
                        //$scope.disabled = false;
                        //$scope.registerForm = {};
                      });
                  }

                };
              }]


});
