(function (angular) {
    'use strict';

    var character = angular.module('character', ['services.stats',
        'services.store']);

    character.config(function ($routeProvider) {
        $routeProvider.when('/character/:room/:characterName', {
            templateUrl: 'DND/app/character/character.html',
            controller: 'CharacterController'
        })
                .when('/character/:room', {
                    templateUrl: 'DND/app/character/character.html',
                    controller: 'CharacterController'
                })
                .when('/character/', {
                    templateUrl: 'DND/app/character/character.html',
                    controller: 'CharacterController'
                });
    });

    character.controller('CharacterController', function ($http, $scope, $routeParams, statsService, socketService, storeService, alertService) {

        $scope.states = [{
                id: 'details',
                title: 'Chactacter Details'
            }, {
                id: 'abilities',
                title: 'Abilities'
            }, {
                id: 'currentStats',
                title: 'Current Stats'
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
            }, {
                id: 'diceroller',
                title: 'Dice Roller'
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
        $scope.hangoutURL;

        $scope.socket.on('new-map', function (imgSrc) {
            $scope.mapImage = imgSrc;
        });

        $scope.socket.on('dm-storeOpen', function (storeData) {
            $scope.storeTableData = storeService.storeTableData = storeData;
            alertService.alert("Store is open!", 1);
            $scope.$apply();
        });

        $scope.socket.on('dm-storeClose', function () {
            $scope.storeTableData = storeService.storeTableData = null;
            alertService.alert("Store is closed!", 0);
            $scope.$apply();
        });

        $scope.socket.on('hangout-url', function (url) {
            console.log(url);
            $scope.hangoutURL = url;
        });

        $scope.init = function () {
            if ($routeParams.room !== undefined) {
                socketService.setRoom($routeParams.room);
            }
            $scope.socket.emit('player-check', function (data) {
                if (data.map !== undefined)
                    $scope.mapImage = data.map;
                if (data.store !== undefined)
                    $scope.storeTableData = storeService.storeTableData = data.store;
                if (data.hangout !== undefined)
                    $scope.hangoutURL = data.hangout;
                $scope.$apply();
            });
            if ($routeParams.characterName !== undefined) {
                statsService.setValues($scope, $http, alertService);
                $scope.characterStats.name = $routeParams.characterName;
                statsService.load();
            }
        };

        $scope.init();
    });

    character.controller('DetailsController', function ($scope, statsService, alertService) {

        $scope.save = statsService.save;

        $scope.load = statsService.load;
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
        $scope.getKeys = function (array) {
            if (array === undefined || array === null) {
                return [];
            }
            var keyList = Object.keys(array);
            if (keyList.indexOf('$$hashKey') > -1) {
                delete keyList[keyList.indexOf('$$hashKey')];
            }
            return keyList;
        };
    });
    
    dm.controller('DiceRollerController', function ($scope) {
        $scope.diceSideOptions = [3, 4, 6, 8, 10, 12, 20];
        $scope.rollDice = function () {
            $scope.result = "";
            for (var a = 0; a < $scope.numRolls; a++) {
                if (a !== 0) {
                    $scope.result = $scope.result + " - ";
                }
                $scope.result = $scope.result + Math.floor((Math.random() * $scope.diceSides) + 1);
            }
        };
    });

})(angular);
