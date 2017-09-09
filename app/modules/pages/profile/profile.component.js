// Register the `profile` component on the `profile` module,
angular.module('mealApp').component('profile', {
  templateUrl: 'modules/pages/profile/profile.template.html'
});

/*mealApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});*/