angular.module('mealApp').controller('dettagli-account',
              ['$scope', 'UserService', 'moment',

                function ($scope, UserService, moment) {
                  UserService.getUser()
                  .then(function(response) {
                    $scope.user = response.data.user;
                    $scope.updateForm = $scope.user;

                    $scope.user.formattedBornDate = moment($scope.user.bornDate).format('DD-MM-YYYY').toString();//parse per manipolazione moment
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
                      .catch(function (error) {
                        $scope.error = true;
                        $scope.errorMessage = error.data.message;
                        $scope.disabled = true;
                        $scope.updateForm = {};
                      });

                  }
                },

              ]

);