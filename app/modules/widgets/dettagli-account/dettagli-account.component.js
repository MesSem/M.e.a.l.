angular.module('mealApp').controller('dettagli-account',
              ['$scope', 'UserService', 'moment', 'Upload',

                function ($scope, UserService, moment, Upload) {
                  UserService.getUser()
                  .then(function(response) {
                    $scope.user = response.data.user;
                    $scope.updateForm = $scope.user;

                    $scope.user.formattedBornDate = moment($scope.user.bornDate).format('DD-MM-YYYY').toString();//parse per manipolazione moment
                  })
                  
                  $scope.showInput = false;

                  $scope.toggleShowInput = function() {//alterno tra mostra e modifica
                    $scope.showInput = !$scope.showInput;
                  },
                
                  $scope.updateUser = function () {//invio dati modificati
                    // initial values
                    $scope.error = false;
                    $scope.success = false;
                    $scope.disabled = true;

                    // call register from service
                    UserService.updateUser($scope.updateForm)
                      // handle success
                      .then(function () {
                        $scope.success = true;
                        $scope.successMessage = "Update successfully!";
                        $scope.disabled = false;
                      })
                      // handle error
                      .catch(function (error) {
                        $scope.error = true;
                        $scope.errorMessage = error.data.message;
                        $scope.disabled = true;
                        $scope.updateForm = {};
                      });

                  },

                  $scope.uploadIdentity = function () {//invio documento identità
                    // initial values
                    $scope.errorID = false;
                    $scope.successID = false;

                    // call register from service
                    Upload.upload({
                      url: '/api/user/uploadDoc', //webAPI exposed to upload the file
                      arrayKey: '',
                      data:{file: {doc: $scope.uploadDoc}} //pass file as data, should be user ng-model
                    }).then(function () {
                        $scope.successID = true;
                        $scope.successIDMessage = "Upload successfully!";
                        $scope.user.verified = "WAITING";
                      })
                      // handle error
                      .catch(function (error) {
                        $scope.errorID = true;
                        $scope.errorIDMessage = 'Error during upload';
                      });

                  }
                },

              ]

);