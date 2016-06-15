(function () {
  'use strict';

  var dnd = angular.module('dnd', [
    'ngRoute',
    'ngMaterial',
    'dm',
    'character',
    'services.alert',
    'services.socket'
  ]);

  dnd.config(function ($routeProvider) {
      $routeProvider.when('/', {
          templateUrl: 'DND/app/dashboard.html',
          controller: 'DashboardController'
      });
  });

  dnd.controller('DashboardController', function ($scope, $location) {
      
      $scope.load = function() {
          var newLocation = "/character";
          if ($scope.characterName !== undefined) {
              newLocation += "/" + $scope.characterName;
          }
          $location.path(newLocation);
      };
  });

})();
