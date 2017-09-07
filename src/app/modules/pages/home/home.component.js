// Register the `home` component on the `home` module,
angular.module('home').component('home', {
  templateUrl: 'modules/pages/home/home.template.html',
  controller: function (UserService, $location) {

/*
    addStudent.save = function () {
      UserService.addStudent(addStudent.student).then(
        function (res) {
          $location.path('');
        }
      )
    }*/

  }
});
