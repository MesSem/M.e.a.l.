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

                    exp = $scope.cardForm.endDate.split('/');

                    if (/^\d+$/.test(exp[0]) && /^\d+$/.test(exp[1])) {//controllo se ci sono solo cifre
                      fDate = moment().year('20' + exp[1]).month(parseInt(exp[0])-1).date(1).hour(1).minute(0).second(0);
                    }
                    else {
                      fDate = false;
                    }

                    if (!fDate || fDate.isBefore(moment().toDate())) {//controllo la scadenza
                      $scope.cardError = true;
                      $scope.cardErrorMessage = 'Error: invalid expiration date';
                    }
                    else {
                      $scope.cardForm.endDate = fDate.toDate();
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
                    }

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
