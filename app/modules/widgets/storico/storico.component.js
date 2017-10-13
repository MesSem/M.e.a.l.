angular.module('mealApp').controller('storico',
              ['$scope', 'UserService', '$sce', '$filter', 'moment',

                function($scope, UserService, $sce, $filter, moment) {
                  UserService.getTransactions()//prendo lista transazioni
                  .then(function(response) {
                    $scope.transactions = response.data.transactions;
                  })
              }
            ]
);
