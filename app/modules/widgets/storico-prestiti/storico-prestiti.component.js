angular.module('mealApp').controller('storico-prestiti',
              ['$scope', 'UserService', '$sce', '$filter', 'moment',

                function($scope, UserService, $sce, $filter, moment) {


                  UserService.getDoneLoans()//prendo lista prestiti
                  .then(function(response) {
                    $scope.loans = response.data.loans;

                  })
              }
            ]
);
