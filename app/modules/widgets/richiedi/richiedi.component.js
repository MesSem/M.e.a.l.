angular.module('mealApp').controller('richiedi',
                ['$scope', 'UserService', '$sce', '$filter',

                function($scope, UserService, $sce, $filter) {
                    
                    UserService.getUser()
                    .then(function(response) {
                        $scope.user = response.data.user;
                    })

                    UserService.getUserList()
                    .then(function(response) {
                        $scope.usersList = response.data.users;
                    });


                    $scope.requestMoney = function () {
                        $scope.newNotifError = false;
                        $scope.newNotifSuccess = false;
                        
                        addMsg = '';
                        if ($scope.message)
                            addMsg = 'Ti ha inoltre scritto il seguente messaggio: "' + $scope.message + '"';

                        message = 'L\'utente ' + $scope.user.username + ' ti ha richiesto la cifra di €' + $scope.money + '.' + addMsg;

                        UserService.newNotification($scope.selected_user._id, message)
                        // handle success
                        .then(function () {
                            $scope.newNotifSuccess = true;
                        })
                        // handle error
                        .catch(function (error) {
                            console.log(error);
                            $scope.newNotifError = true;
                            $scope.newNotifErrorMessage = error.data.message;
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

);