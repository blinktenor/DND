(function (angular) {
    'use strict';

    var character = angular.module('character', ['services.stats',
                                                 'services.store']);

    character.config(function ($routeProvider) {
        $routeProvider.when('/character', {
            templateUrl: 'app/character/character.html',
            controller: 'CharacterController'
        });
    });

    character.controller('CharacterController', function ($scope, statsService, socketService, storeService, alertService) {

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

        $scope.socket = socketService.socket;

        $scope.characterStats = statsService.characterStats;
        
        $scope.storeTableData = storeService.storeTableData;

        $scope.$watch(function() {return statsService.characterStats;}, function () {
            $scope.socket.emit('player-update', $scope.characterStats);
        }, true);
        
        $scope.mapImage;
        
        $scope.socket.on('new-map', function (imgSrc) {
            $scope.mapImage = imgSrc;
        });
        
        $scope.socket.on('dm-storeOpen', function (storeData) {
            $scope.storeTableData = storeService.storeTableData = storeData;
            alertService.alert("Store is open!", 1);
            $scope.$apply();
        });
        
        $scope.socket.on('dm-storeClose', function (storeData) {
            $scope.storeTableData = storeService.storeTableData = null;
            alertService.alert("Store is closed!", 0);
            $scope.$apply();
        });
    });

    character.controller('DetailsController', function ($scope, $http, statsService, alertService) {

        $scope.save = function () {

            if ($scope.characterStats.name !== "" && $scope.characterStats.name !== undefined) {
                $http({
                    method: 'POST',
                    url: 'source/save',
                    data: $scope.characterStats
                }).then(function successCallback(response) {
                    alertService.alert("Character Saved!", 1);
                });
            } else {
                alertService.alert("Enter character name", 0);
            }
        };

        $scope.load = function () {

            if ($scope.characterStats.name !== "" && $scope.characterStats.name !== undefined) {
                $http({
                    method: 'POST',
                    url: 'source/load',
                    data: {name: $scope.characterStats.name}
                }).then(function successCallback(response) {
                    angular.copy(response.data, statsService.characterStats);
                    alertService.alert("Character Loaded!", 1);
                });
            } else {
                alertService.alert("Enter character name", 0);
            }
        };
    });

    character.controller('CurrentStatsController', function ($scope) {
        $scope.change = function (stat) {
            switch (stat) {
                case "currentHp":
                    $scope.characterStats[stat] = Number($scope.characterStats.hp);
                    break;
                case "iMp":
                    $scope.characterStats[stat] = Number($scope.characterStats.intelligence);
                    break;
                case "wMp":
                    $scope.characterStats[stat] = Number($scope.characterStats.wisdom);
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

})(angular);
