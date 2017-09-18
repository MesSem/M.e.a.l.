angular.module('mealApp').component('profile', {
  templateUrl: 'modules/pages/profile/profile.template.html',
  controller: ['$scope', 'UserService',
                function($scope, UserService) {
                  UserService.getUser()
                  .then(function(response) {
                    user = response.data.user;
                    $scope.user = user;
                    $scope.updateForm = user;

                    $scope.cardForm = {};
                    $scope.cardForm._id = user._id;
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

                  },

                  $scope.addCard = function () {
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

                  $scope.deleteCard = function (cardId, userId) {
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
});