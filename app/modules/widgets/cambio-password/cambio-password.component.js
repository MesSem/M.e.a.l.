angular.module('mealApp').controller('cambio-password',
['$scope', 'UserService',

    function ($scope, UserService) {
        UserService.getUser()
        .then(function(response) {
            $scope.user = response.data.user;

        })

        $scope.changePw = function () {
            if ($scope.newPassword == $scope.repeatPassword)
                UserService.changePw($scope.oldPassword, $scope.newPassword)
                // handle success
                .then(function () {
                    $scope.pwSuccess = true;
                    $scope.pwSuccessMessage = "Update successfully!";
                })
                // handle error
                .catch(function (error) {
                    console.log(error);
                    $scope.pwError = true;
                    $scope.pwErrorMessage = 'Error: ' + error.data.err.name;
                });
            else {
                $scope.pwError = true;
                $scope.pwErrorMessage = 'Le password non coincidono';
            }
        }

}
]
);