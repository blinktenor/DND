(function (angular) {
//    var socket = io();

    var dm = angular.module('dm', []);

    dm.config(function ($routeProvider) {
        $routeProvider.when('/dm', {
            templateUrl: 'app/dm/dm.html',
            controller: 'DMController'
        });
    });

    dm.controller('DMController', function ($scope) {
        $scope.states = [{
                id: 'characters',
                title: 'Characters'
            }, {
                id: 'notes',
                title: 'Notes'
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

    dm.controller('StoreController', function ($scope, $http, alertService) {
        $scope.storeTables = ["Armor", "Weapons", "Gear", "Magic"];

        $scope.MAGIC_ITEM_COST_MODIFIER = [500, 1000, 2000, 8000, 15000];

        $scope.controlData = [
            {Name: "Gear", Chance: 85, NumberAppearing: 20},
            {Name: "Armor", Chance: 85, NumberAppearing: 5},
            {Name: "Weapons", Chance: 85, NumberAppearing: 5},
            {Name: "Magic", Chance: 25, NumberAppearing: 5}
        ];

        $scope.controlCols = Object.keys($scope.controlData[0]);

        $scope.storeTableData = null;

        $scope.notSorted = function (obj) {
            if (!obj) {
                return [];
            }
            return Object.keys(obj);
        };

        $scope.getKeys = function (array) {
            var keyList = Object.keys(array);
            if (keyList.indexOf('$$hashKey') > -1) {
                delete keyList[keyList.indexOf('$$hashKey')];
            }
            return keyList;
        };

        $scope.loadStore = function () {

            $http({
                method: 'GET',
                url: 'source/loadGear'
            }).then(function successCallback(response) {
                var magicItemList = [];
                var storeContents = response.data.split("###");
                var storeCount;
                var newStoreData = {};
                //Minus 1 for the magic items at the end
                for (storeCount = 0; storeCount < storeContents.length - 1; storeCount++) {
                    var currentStoreItems = [];
                    var set = storeContents[storeCount].split("\r\n");
                    if (storeCount > 0)
                        magicItemList = magicItemList.concat(set);
                    for (var itemCount = 0; itemCount < set.length; itemCount++) {
                        if (Math.floor((Math.random() * 100) + 1) <= $scope.controlData[storeCount].Chance) {
                            var item = set[itemCount].split(";");
                            var newItem = {};
                            newItem["Item Name"] = item[0];
                            newItem.Price = item[1];
                            newItem.Quantity = Math.floor((Math.random() * $scope.controlData[storeCount].NumberAppearing) + 1);
                            currentStoreItems.push(newItem);
                        }
                    }
                    newStoreData[$scope.controlData[storeCount].Name] = currentStoreItems;
                }

                //Magic Items
                magicItemList = magicItemList.concat(storeContents[storeContents.length - 1].split("\r\n"));
                //get from the array, then look how long the split is >2 then cost is third
                var magicStoreItems = [];
                for (var numOfMagicItems = 0; numOfMagicItems < $scope.controlData[storeCount].NumberAppearing; numOfMagicItems++) {
                    if (Math.floor((Math.random() * 100) + 1) <= $scope.controlData[storeCount].Chance) {
                        var newItem = {};
                        var itemNumber = Math.floor((Math.random() * (magicItemList.length - 1)) + 1);
                        var item = magicItemList[itemNumber].split(";");
                        var itemBoost, itemName;
                        if (item.length > 2) {
                            itemName = item[0];
                            itemBoost = Math.floor((Math.random() * item[1]) + 1);
                            if (item[1] > 1) {
                                itemName = itemName + " +" + itemBoost;
                            }
                            var itemCostArray = item[2].split(",");
                            newItem["Item Name"] = itemName;
                            newItem.Price = itemCostArray[itemBoost - 1];
                        } else {
                            itemBoost = Math.floor((Math.random() * 5) + 1);
                            newItem["Item Name"] = item[0] + " +" + itemBoost;
                            newItem.Price = parseInt(item[1]) * $scope.MAGIC_ITEM_COST_MODIFIER[itemBoost - 1];
                        }
                        newItem.Quantity = Math.floor((Math.random() * 2) + 1);
                        magicStoreItems.push(newItem);
                    }
                }
                newStoreData[$scope.controlData[storeCount].Name] = magicStoreItems;
                $scope.storeTableData = newStoreData;
            }, function errorCallback(response) {
                alertService.alert("Error getting store data!", 0);
            });
        };

        $scope.closeStore = function () {
            socket.emit('dm-storeClose', '');
        };

        $scope.pushStore = function () {
            socket.emit('dm-storeOpen', $scope.storeTableData);
        };

        $scope.getKeys = function (array) {
            var keyList = Object.keys(array);
            if (keyList.indexOf('$$hashKey') > -1) {
                delete keyList[keyList.indexOf('$$hashKey')];
            }
            return keyList;
        };
    });


    dm.controller('MapController', function ($scope, $http, alertService) {

        $scope.mapCollection;
        $scope.imageModel;

        $scope.init = function () {
            $http({
                    method: 'GET',
                    url: 'source/psdData'
                }).then(function successCallback(response) {
                    $scope.mapCollection = response.data;
                    alertService.alert("Adventure Saved!", 1);
                });
        }

        $scope.init();
    });

    dm.controller('NotesController', function ($scope, $http, alertService) {

        $scope.saveNotes = function () {
            if ($scope.adventureName !== "") {
                var userData = {
                    "dmNotes": $scope.dmNotes,
                    "name": $scope.adventureName
                };

                $http({
                    method: 'POST',
                    url: 'source/saveDm',
                    data: userData
                }).then(function successCallback(response) {
                    alertService.alert("Adventure Saved!", 1);
                });
            } else {
                alertService.alert("Enter adventure name", 0);
            }

        };

        $scope.loadNotes = function () {
            if ($scope.adventureName !== "") {
                $http({
                    method: 'POST',
                    url: 'source/loadDm',
                    data: {"name": $scope.adventureName}
                }).then(function successCallback(response) {
                    var valueKey = response.data.split("~");
                    $scope.dmNotes = valueKey[1].substr(valueKey[1].indexOf(":") + 1);
                    alertService.alert("Adventure loaded!", 1);
                });
            } else {
                alertService.alert("Enter Adventure name", 0);
            }
        };
    });

    dm.controller('CharactersController', function ($scope) {
        $scope.characterTableData
                = [
                    {
                        Name: "Fayde",
                        Armor: "11",
                        CurrentHp: "27",
                        IMp: "1",
                        WMp: "0",
                        Strength: "1",
                        Intelligence: "6",
                        Wisdom: "0",
                        Dexterity: "4",
                        Constitution: "4",
                        Charisma: "-3"
                    }
                ];

        $scope.characterTableCheckBoxes
                = {
                    Name: true,
                    Armor: true,
                    CurrentHp: true,
                    IMp: true,
                    WMp: true,
                    Strength: true,
                    Intelligence: true,
                    Wisdom: true,
                    Dexterity: true,
                    Constitution: true,
                    Charisma: true
                };

        $scope.getKeys = function (array) {
            var keyList = Object.keys(array);
            if (keyList.indexOf('$$hashKey') > -1) {
                delete keyList[keyList.indexOf('$$hashKey')];
            }
            return keyList;
        };

    });
})(angular);
