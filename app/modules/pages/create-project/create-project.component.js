angular.module('mealApp').component('createProject', {
  templateUrl: 'modules/pages/create-project/create-project.template.html',
  controller: ['$scope', '$location', 'UserService','Upload',
              function ($scope, $location, UserService, Upload) {
                  $scope.error = false;
                  $scope.disabled = false;
                  $scope.progress=0;
                  $scope.createProject = function () {

                    var mainImage = $scope.projectForm.mainImage;
                    var gallery = $scope.projectForm.gallery;

                    delete $scope.projectForm.mainImage;//evito il doppio upload
                    delete $scope.projectForm.gallery;

                    Upload.upload({
                      url: 'http://localhost:8080/api/user/project', //webAPI exposed to upload the file
                      arrayKey: '',
                      data:{file: {main: mainImage, gallery: gallery}, form: $scope.projectForm} //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
                      if(resp.data.error_code === 0){ //validate success
                        alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                      } else {
                        alert('an error occured');
                      }
                    }, function (resp) { //catch error
                      console.log('Error status: ' + resp.status);
                      //$window.alert('Error status: ' + resp.status);
                    }, function (evt) {
                      console.log(evt);
                      //GESTIONE PROGESS BAR, commentato ma in futuro figo
                      //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                      //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                  });
                  };
              }]
});
