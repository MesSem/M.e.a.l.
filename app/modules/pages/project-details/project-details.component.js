angular.module('mealApp').component('projectDetails', {
  templateUrl: 'modules/pages/project-details/project-details.template.html',
  controller: ['$scope', '$location','UserService', 'moment',
                  function($scope,$location, UserService, moment) {
                    UserService.getProject($location.search().id)
                    .then(function(response) {
                        $scope.project = response.data.project;
                      });
                      UserService.getUser().then(function(response) {
                        $scope.user = response.data.user;
                      });

                      $scope.createLoan = function () {
                        console.log($scope);
                          $scope.moneyError = false;

                          //creo oggetto transazione da dati del form
                          var loan = {projectRecipient: $scope.project._id, money: $scope.loanForm.loanValue, notes: $scope.loanForm.message}

                          UserService.createLoan(loan)//aggiungo prestito
                          // handle success
                          .then(function () {
                              window.location.reload();
                          })
                          // handle error
                          .catch(function (error) {
                              console.log(error);
                              $scope.moneyError = true;
                              $scope.moneyErrorMessage = error.data.message;
                          });

                      }
              }]
});
