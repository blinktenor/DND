var ITEM_CHANCE_COUNT = [100, 100, 100, 3, 95, 20, 5, 25];

var MAGIC_ITEMS_COUNT_CHANCE = [5, 25];

var MAGIC_ITEM_COST_MODIFIER = [500, 1000, 2000, 8000, 15000];

var socket = io();

/**
 * Document start, check what players are in, and assign the checkbox function
 * @param {type} param
 */
$(document).ready(function () {
    
    socket.emit('player-check');
    
    $("#checkBoxToggle").click(function () {
        $("#checkBoxForm").toggle();
    });
});

socket.on('dm-login', function (name) {
    loadChar(name);
});
socket.on('players', function (names) {
    for (var a = 0; a < names.length; a++) {
        loadChar(names[a]);
    }
});
socket.on('dm-disconnect', function (name) {
    removeCharacterRow(name);
});
socket.on('dm-player-update', function (updateData) {
    updateCharacterData(updateData);
});

/**
 * Create the store on the master page, loading all of the store contents
 */
function loadStore() {
    loadModifiers();
    clearStore();
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
}

/**
 * Deletes the contents of the store div and sets the message that the store is closed.
 * 
 * @returns {undefined}
 */
function clearStore() {
    var myNode = document.getElementById("storeDiv");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    myNode.innerHTML = "Store is closed!";
}