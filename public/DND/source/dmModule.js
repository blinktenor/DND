var socket = io();

var dm = angular.module('dm', []);

dm.controller('dmController', function ($scope) {

    $scope.diceSideOptions = [3, 4, 6, 8, 10, 12, 20];

    $scope.storeTables = ["Armor", "Weapons", "Gear", "Magic"];

    $scope.controlData = [
        {Name: "Gear", Chance: 85, NumberAppearing: 20},
        {Name: "Armor", Chance: 85, NumberAppearing: 5},
        {Name: "Weapons", Chance: 85, NumberAppearing: 5},
        {Name: "Magic", Chance: 25, NumberAppearing: 5}
    ];
    
    $scope.controlCols = Object.keys($scope.controlData[0]);
    
    $scope.storeTableData = {
        Gear: [
            {itemName: 'arrow', price: '.1'},
            {itemName: 'backpack', price: '1'}
        ],
        Armor: [
            {itemName: 'leather', price: '1'},
            {itemName: 'chainmail', price: '1'}
        ],
        Weapons: [
            {itemName: 'sword', price: '1'},
            {itemName: 'sling', price: '1'}
        ],
        Magic: [
            {itemName: 'potion', price: '1'},
            {itemName: 'wand', price: '1'}
        ]
    };
    
    $scope.storeTableHeaders = Object.keys($scope.storeTableData);
    
    $scope.notSorted = function (obj) {
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    };
    
    $scope.getKeys = function(array) {
        var keyList = Object.keys(array);
        if (keyList.indexOf('$$hashKey') > -1) {
            delete keyList[keyList.indexOf('$$hashKey')];
        }
        return keyList;
    };

    $scope.rollDice = function () {

        $scope.result = "";

        for (var a = 0; a < $scope.numRolls; a++) {
            if (a !== 0) {
                $scope.result = $scope.result + " - ";
            }
            $scope.result = $scope.result + Math.floor((Math.random() * $scope.diceSides) + 1);
        }
    };

    $scope.loadStore = function () {
        $.ajax({
            url: 'source/loadGear',
            data: "",
            type: 'GET',
            success: function (output) {
                var magicItemList = [];
                var storeContents = output.split("###");
                var rowCount = 0;
                var storeCount;
                //Minus 1 for the magic items at the end
                for (storeCount = 0; storeCount < storeContents.length - 1; storeCount++) {
                    var storeTable = buildNewStoreTable(storeCount);
                    rowCount = 0;
                    var set = storeContents[storeCount].split("\r\n");
                    if (storeCount > 0)
                        magicItemList = magicItemList.concat(set);
                    for (var itemCount = 0; itemCount < set.length; itemCount++) {
                        if (Math.floor((Math.random() * 100) + 1) <= ITEM_CHANCE_COUNT[storeCount * 2]) {
                            var row = storeTable.insertRow(rowCount + 1);
                            rowCount++;
                            var item = set[itemCount].split(";");
                            row.insertCell(0).innerHTML = item[0];
                            row.insertCell(1).innerHTML = item[1];
                            row.insertCell(2).innerHTML = Math.floor((Math.random() * ITEM_CHANCE_COUNT[storeCount * 2 + 1]) + 1);
                        }
                    }
                }

                //Magic Items
                magicItemList = magicItemList.concat(storeContents[storeContents.length - 1].split("\r\n"));
                var storeTable = buildNewStoreTable(storeCount);
                rowCount = 0;
                //get from the array, then look how long the split is >2 then cost is third
                for (var numOfMagicItems = 0; numOfMagicItems < ITEM_CHANCE_COUNT[7]; numOfMagicItems++) {
                    if (Math.floor((Math.random() * 100) + 1) <= ITEM_CHANCE_COUNT[6]) {
                        var row = storeTable.insertRow(rowCount + 1);
                        rowCount++;
                        var itemNumber = Math.floor((Math.random() * (magicItemList.length - 1)) + 1);
                        var item = magicItemList[itemNumber].split(";");
                        var itemBoost;
                        var itemCost;
                        var itemName;
                        if (item.length > 2) {
                            itemName = item[0];
                            itemBoost = Math.floor((Math.random() * item[1]) + 1);
                            if (item[1] > 1) {
                                itemName = itemName + " +" + itemBoost;
                            }
                            var itemCostArray = item[2].split(",");
                            var itemCost = itemCostArray[itemBoost - 1];
                        } else {
                            itemBoost = Math.floor((Math.random() * 5) + 1);
                            itemName = item[0] + " +" + itemBoost;
                            itemCost = parseInt(item[1]) * MAGIC_ITEM_COST_MODIFIER[itemBoost - 1];
                        }
                        row.insertCell(0).innerHTML = itemName;
                        row.insertCell(1).innerHTML = itemCost;
                        row.insertCell(2).innerHTML = Math.floor((Math.random() * 2) + 1);
                    }
                }
            },
            error: function (error) {
                updateAlert("error!", 0);
            }
        });
    };

    $scope.closeStore = function () {
        socket.emit('dm-storeClose', '');
    };

    $scope.pushStore = function () {
        /*
         var tableNum = 0;
         var storeContents = [];
         var table = document.getElementById("storeTable" + tableNum);
         while (table !== null) {
         var itemType = table.caption.innerHTML.replace("<b>", "").replace("</b>", "");
         for (var a = 1; a < table.rows.length; a++) {
         var cells = table.rows[a].cells;
         var rowData = [itemType, cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML];
         storeContents.push(rowData);
         }
         tableNum++;
         var table = document.getElementById("storeTable" + tableNum);
         }
         socket.emit('dm-storeOpen', storeContents);
         */
    };
});