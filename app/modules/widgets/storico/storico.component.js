angular.module('mealApp').controller('storico',
              ['$scope', 'UserService', '$sce', '$filter',

                function($scope, UserService, $sce, $filter) {

                UserService.getUserList()//prendo lista utenti
                .then(function(response) {
                  $scope.usersList = response.data.users;

                  UserService.getTransactions()//prendo lista transazioni
                  .then(function(response) {
                    $scope.transactions = response.data.transactions;
                    angular.forEach($scope.transactions, function(tran, key) {//associo l'id di ogni utente con il proprio nome
                      $scope.transactions[key].senderName = $filter('filter')($scope.usersList, {_id: tran.sender })[0].username;
                      $scope.transactions[key].recipientName = $filter('filter')($scope.usersList, {_id: tran.recipient })[0].username;  
                    });
                  })
                });
              }
            ]
);