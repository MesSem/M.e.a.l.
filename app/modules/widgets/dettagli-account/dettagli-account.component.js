angular.module('mealApp').controller('dettagli-account',
              ['$scope', 'UserService',

                function ($scope, UserService) {
                  UserService.getUser()
                  .then(function(response) {
                    $scope.user = response.data.user;
                    $scope.updateForm = $scope.user;
                  })
                  
                  $scope.showInput = false;

                  $scope.toggleShowInput = function() {//alterno tra mostra e modifica
                    $scope.showInput = !$scope.showInput;
                  },
                
                  $scope.updateUser = function () {//invio dati modificati
                    // initial values
                    $scope.error = false;
                    $scope.disabled = true;

                    // call register from service
                    UserService.updateUser($scope.updateForm)
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

);