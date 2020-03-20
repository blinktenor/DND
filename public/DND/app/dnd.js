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

  dnd.controller('DashboardController', function ($scope, $location, socketService) {

    $scope.socket = socketService.socket;

    $scope.socket.on("roomList", function (list) {
      setRooms(list);
    });

    $scope.join = function (room) {
      var newLocation = "/character/" + room.name;
      if (room.characterName !== undefined) {
        newLocation += "/" + room.characterName;
      }
      $location.path(newLocation);
    };

    function setRooms(list) {
      $scope.rooms = {};
      for(var a = 0; a < list.length; a++) {
        $scope.rooms[list[a]] = {};
        $scope.rooms[list[a]].name = list[a];
      }
      $scope.$apply();
    }

    $scope.roomSize = function() {
      return $scope.rooms !== undefined &&
      Object.keys($scope.rooms).length > 0;
    };

    $scope.init = function () {
      $scope.socket.emit('roomCheck', function (list) {
        setRooms(list);
      });
    };

    $scope.init();
  });
})();
