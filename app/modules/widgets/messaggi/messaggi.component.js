angular.module('mealApp').controller('messaggi',
                ['$scope', 'UserService', '$sce', '$filter', 'moment',

                function($scope, UserService, $sce, $filter, moment) {
                    
                    UserService.getUser()
                    .then(function(response) {
                        $scope.user = response.data.user;
                    })

                },

                ]

);