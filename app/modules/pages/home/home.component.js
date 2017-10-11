angular.module('mealApp').component('home', {
  templateUrl: 'modules/pages/home/home.template.html',
  controller: ['$http','$scope', 'moment',
                  function($http,$scope, moment) {
                    getProjects()//prendo lista progetti
                    .then(function(response) {
                      $scope.projectsList = response.data.projects;
                      });

                      //Ho messo qui la chiamata alle api qui perchè non è relativa all'user
                  var cachedProjects = null;
                  function getProjects() {
                    if(!cachedProjects) cachedProjects = $http.get('/api/listProjects');
                    return cachedProjects;
                  }
              }]
  });
