angular.module('mealApp').component('profile', {
  templateUrl: 'modules/pages/profile/profile.template.html',
  controller: ['$scope', 'UserService', '$sce', '$filter',
                function($scope, UserService, $sce, $filter) {
                  UserService.getUser()
                  .then(function(response) {
                    user = response.data.user;
                    $scope.user = user;
                    $scope.updateForm = user;

                    $scope.cardForm = {};
                    $scope.cardForm._id = user._id;
                  })


                  UserService.getUserList()
                  .then(function(response) {
                    $scope.usersList = response.data.users;

                    UserService.getTransactions()//associo l'id di ogni utente con il proprio nome
                    .then(function(response) {
                      $scope.transactions = response.data.transactions;
                      angular.forEach($scope.transactions, function(tran, key) {
                        $scope.transactions[key].senderName = $filter('filter')($scope.usersList, {_id: tran.sender })[0].username;
                        $scope.transactions[key].recipientName = $filter('filter')($scope.usersList, {_id: tran.recipient })[0].username;  
                      });
                    })
                  });


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

                  },

                  $scope.sendMoney = function () {
                    $scope.moneyError = false;

                    var transaction = {sender: user._id, recipient: $scope.selected_user._id, money: $scope.money, notes: $scope.message}

                    // call register from service
                    UserService.sendMoney(transaction)
                      // handle success
                      .then(function () {
                        window.location.reload();
                      })
                      // handle error
                      .catch(function (error) {
                        console.log(error);
                        $scope.moneyError = true;
                        $scope.moneyErrorMessage = 'Error: ' + error.data.err.name;
                      });

                  }

                  //gestione autocompletamento
                  function highlight(str, term) {
                    var highlight_regex = new RegExp('(' + term + ')', 'gi');
                    return str.replace(highlight_regex, '<span class="highlight">$1</span>');
                  }
                  
                  function suggest_users(term) {
                    var q = term.toLowerCase().trim(),
                        results = [];
                    
                    usersList = $scope.usersList;

                    for (var i = 0; i < usersList.length; i++) {
                      var user = usersList[i];
                      if (user.username.toLowerCase().indexOf(q) !== -1)
                        results.push({
                          value: user.username,
                          // Pass the object as well. Can be any property name.
                          obj: user,
                          label: $sce.trustAsHtml(highlight(user.username,term))
                        });
                    }
                    return results;
                 };

                $scope.autocomplete_options = {
                  suggest: suggest_users,
                  on_select: function (selected) {
                    $scope.selected_user = selected.obj;
                  }
                };
                //fine autocompletamento

                },

              ]
});