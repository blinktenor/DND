(function (angular) {
    'use strict';

    var character = angular.module('character', []);

    character.config(function ($routeProvider) {
        $routeProvider.when('/character', {
            templateUrl: 'app/character/character.html',
            controller: 'CharacterController'
        });
    });

    character.controller('CharacterController', function ($scope, statsService, socketService) {

        $scope.states = [{
                id: 'details',
                title: 'Chactacter Details'
            }, {
                id: 'currentStats',
                title: 'Current Stats'
            }, {
                id: 'abilities',
                title: 'Abilities'
            }, {
                id: 'equipment',
                title: 'Equipment'
            }, {
                id: 'skills',
                title: 'Skills'
            }, {
                id: 'spells',
                title: 'Spells'
            }, {
                id: 'maps',
                title: 'Maps'
            }, {
                id: 'store',
                title: 'Store'
            }];

        $scope.state = $scope.states[0];

        $scope.selectState = function (state) {
            $scope.state = state;
        };

        $scope.characterStats = statsService.characterStats;
        
        $scope.socket = socketService.socket;
    });

    character.controller('DetailsController', function ($scope, $http, statsService, socketService) {

        $scope.save = function () {

            $scope.socket.emit('sockettest');

            if ($scope.characterStats.name !== "" && $scope.characterStats.name !== undefined) {
                $http({
                    method: 'POST',
                    url: 'source/save',
                    data: $scope.characterStats
                }).then(function successCallback(response) {
//                    updateAlert("Adventure Saved!", 1);
                });
            } else {
//                updateAlert("Enter character name", 0);
            }
        }

        $scope.load = function () {

            if ($scope.characterStats.name !== "" && $scope.characterStats.name !== undefined) {
                $http({
                    method: 'POST',
                    url: 'source/load',
                    data: {name: $scope.characterStats.name}
                }).then(function successCallback(response) {
                    angular.copy(response.data, statsService.characterStats);
//                    updateAlert("Adventure Saved!", 1);
                });
            } else {
//                updateAlert("Enter character name", 0);
            }
        }
    });

    character.controller('CurrentStatsController', function ($scope) {
        $scope.change = function (stat) {
            switch (stat) {
                case "currentHp":
                    $scope.characterStats[stat] = $scope.characterStats.hitPoints;
                    break;
                case "iMp":
                    $scope.characterStats[stat] = $scope.characterStats.intelligence;
                    break;
                case "wMp":
                    $scope.characterStats[stat] = $scope.characterStats.wisdom;
                    break;
                default:
            }
        };
    });

    character.controller('AbilitiesController', function ($scope) {

    });

    character.controller('EquipmentController', function ($scope) {

    });

    character.controller('SkillsController', function ($scope) {

    });

    character.controller('SpellsController', function ($scope) {

    });

    character.controller('MapsController', function ($scope) {

    });

    character.controller('StoreController', function ($scope) {

    });

    character.factory('statsService', function () {
        
        var characterStats = {};

        return {
            characterStats: characterStats
        };
    });

    character.factory('socketService', function () {
        
        var socket = io();
        
        return {
            socket: socket
        };
    });

})(angular);
