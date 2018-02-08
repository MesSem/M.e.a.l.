angular.module('mealApp').component('projectManagement', {
  templateUrl: 'modules/pages/project-management/project-management.template.html',
  controller: ['$scope', '$location','UserService', 'moment',
                  function($scope,$location, UserService, moment) {
                    UserService.getProject($location.search().id)
                    .then(function(response) {
                      $scope.project = response.data.project;
                      $scope.messageProjectVisibile=false;
                      if($scope.project.status.value=="NOT_ACCEPTED" ){
                        $scope.messageProjectVisibile=true;
                        $scope.messageProject=$scope.project.status.messageFromAdmin? $scope.project.status.messageFromAdmin:"Il progetto non può essere pubblicato";
                      }else if($scope.project.status.value=="TO_CHECK" ){
                        $scope.messageProjectVisibile=true;
                        $scope.messageProject="L'amministratore deve ancora controllare il progetto";
                      }
                    });

                    UserService.getLoansOfProject($location.search().id)
                    .then(function(response){
                      $scope.loans=response.data.loans;
                    });

                    $scope.updateProject = function () {
                      UserService.updateProject($scope.project)//aggiungo prestito
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

                    $scope.returnMoney = function () {
                      UserService.returnMoney($scope.project._id)//aggiungo prestito
                      // handle success
                      .then(function () {
                          window.location.reload();
                      })
                      // handle error
                      .catch(function (error) {
                          console.log(error);
                      });
                    }

                    $scope.enumProjects = UserService.getEnumProjects();
              }]
});
