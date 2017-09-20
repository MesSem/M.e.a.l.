angular.module('mealApp').controller('carte-associate',
              ['$scope', '$location', 'UserService',

                function ($scope, $location, UserService) {

                  UserService.getUser()
                  .then(function(response) {
                    $scope.user = response.data.user;

                    $scope.cardForm = {};
                    $scope.cardForm._id = $scope.user._id;
                  })

                  $scope.addCard = function () {//aggiungo nuova card
                    $scope.cardError = false;

                    // call register from service
                    UserService.addCard($scope.cardForm)
                      // handle success
                      .then(function () {
                        window.location.reload();
                      })
                      // handle error
                      .catch(function (error) {
                        console.log(error);
                        $scope.cardError = true;
                        $scope.cardErrorMessage = 'Error: ' + error.data.err.name;
                      });

                  },

                  $scope.deleteCard = function (cardId, userId) {//elimino card
                    $scope.cardError = false;
                    // call register from service
                    UserService.deleteCard(cardId, userId)
                      // handle success
                      .then(function () {
                        var el = document.getElementById("form-" + cardId);
                        el.remove()
                      })
                      // handle error
                      .catch(function (error) {
                        console.log(error);
                        $scope.cardError = true;
                        $scope.cardErrorMessage = 'Error: ' + error.data.err.name;
                      });

                  }
                },

              ]
);
