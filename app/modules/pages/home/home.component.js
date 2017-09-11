angular.module('mealApp').component('home', {
  templateUrl: 'modules/pages/home/home.template.html'
});

angular.module('mealApp').controller('logoutController',
['$scope', '$location', 'AuthService',
function ($scope, $location, AuthService) {

  $scope.logout = function () {

    // call logout from service
    AuthService.logout()
      .then(function () {
        $location.path('/login');
      });

  },
  $scope.isLoggedIn = function() {
    return AuthService.isLoggedIn();
  };

}]);

