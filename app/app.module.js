
// Define the `mealApp` module
var mealApp = angular.module('mealApp', [
  'ngRoute',
  'profile',
  'register',
  'home',
  'login'
  /*'home',
  'movimenti',
  'prestiti',
  'profilo',
  'common'*/ //li ho commentati perchè per ora esistono i file ma sono o vuoti o non contengono i nomi appropriati
  //forse ci vanno anche i widjets. Probabilmente no, credo vadano dentro home e dentro alla pagine che li utilizzano
]);
