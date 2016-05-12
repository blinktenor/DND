(function () {
  'use strict';

  var dnd = angular.module('dnd', [
    'ngRoute',
    'ngMaterial',
    'dm',
    'character',
    'services.alert'
  ]);

  dnd.config(function ($routeProvider) {
      $routeProvider.when('/', {
          templateUrl: 'app/dashboard.html',
          controller: 'DashboardController'
      });
  });

  dnd.controller('DashboardController', function () {

  });

})();
