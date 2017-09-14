angular.module('mealApp').component('profile', {
  templateUrl: 'modules/pages/profile/profile.template.html',
  controller: ['$scope', 'AuthService',
                function($scope, AuthService) {
                  AuthService.getUser()
                  .then(function(response) {
                    user = response.data.user;
                    $scope.user = user;
                    $scope.updateForm = user;

                    
                    /*delete user._id;
                    delete user.__v;
                    delete user.cards;
                    $scope.userForm = user;*/
                  })

                  $scope.showInput = false;
                  $scope.toggleShowInput = function() {
                    $scope.showInput = !$scope.showInput;
                  },


                  $scope.updateUser = function () {
                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;

                    // call register from service
                    AuthService.updateUser($scope.updateForm)
                      // handle success
                      .then(function () {
                        $scope.success = true;
                        $scope.successMessage = "Update successfully!";
                        $scope.disabled = false;
                      })
                      // handle error
                      .catch(function () {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = true;
                        $scope.updateForm = {};
                      });

                  }
                },

              ]
});