// Register the `addStudent` component on the `addStudent` module,
angular.module('addStudent').component('addStudent', {
  templateUrl: 'modules/pages/add-student/add-student.template.html',
  controller: function (UserService, $location) {
    var addStudent = this;
    addStudent.student = {
      imgUrl: "img/avatar.jpg"
    };

    addStudent.save = function () {
      UserService.addStudent(addStudent.student).then(
        function (res) {
          $location.path('');
        }
      )
    }

  }
});
