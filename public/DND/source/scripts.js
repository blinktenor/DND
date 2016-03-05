var characterNames;

var DICE_DROPDOWN = "diceSides";
var DICE_NUM_OF_ROLLS = "numRolls";
var DICE_RESULT_OF_ROLLS = "result";

var tableLoaded = false;

var DEFAULT_COLUMNS_OFF = ["Class", "Race", "Level", "Exp", "Pack", "Notes"];

var COLUMNS_TO_DISABLE = [];

var CHECK_BOX_COLUMNS = 10;

var ITEM_CHANCE_COUNT = [100, 100, 100, 3, 95, 20, 5, 25];

var MAGIC_ITEMS_COUNT_CHANCE = [5, 25];

var MAGIC_ITEM_COST_MODIFIER = [500, 1000, 2000, 8000, 15000];

var socket = io();

var ajaxCall = false;

function loadModifiers() {
    for (var a = 0; a < 8; a++) {
        if (document.getElementById("mod" + a).value != "") {
            ITEM_CHANCE_COUNT[a] = document.getElementById("mod" + a).value;
        }
    }
}

/**
 *
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
            alert("error!");
        }
    });
}

function clearStore() {
    var myNode = document.getElementById("storeDiv");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function buildNewStoreTable(storeCount) {
    var storeDiv = document.getElementById("storeDiv");
    var storeTable = document.createElement("table");
    storeTable.id = "storeTable" + storeCount;
    storeTable.border = 1;
    var tHead = storeTable.createTHead();
    var row = tHead.insertRow(0);
    row.insertCell(0).innerHTML = "Item";
    row.insertCell(1).innerHTML = "Cost (gp)";
    row.insertCell(2).innerHTML = "Store Quantity";
    var caption = storeTable.createCaption();
    switch (storeCount) {
        case 0:
            caption.innerHTML = "<b>Gear</b>";
            break;
        case 1:
            caption.innerHTML = "<b>Armor</b>";
            break;
        case 2:
            caption.innerHTML = "<b>Weapons</b>";
            break;
        case 3:
            caption.innerHTML = "<b>Magic Items</b>";
            break;
    }
    storeDiv.appendChild(storeTable);
    storeDiv.appendChild(document.createElement('br'));
    return storeTable;
}


/**
 * Function to roll a number of dice of and display the results
 */
function rollDice() {
    var sides = document.getElementById(DICE_DROPDOWN).value;
    var rolls = document.getElementById(DICE_NUM_OF_ROLLS).value;
    var result = document.getElementById(DICE_RESULT_OF_ROLLS);

    result.value = "";

    for (var a = 0; a < rolls; a++) {
        if (a != 0) {
            result.value = result.value + " - ";
        }
        result.value = result.value + Math.floor((Math.random() * sides) + 1);
    }
}

function gatherNames()
{
    $.ajax({
        url: 'source/characterNames',
        data: "",
        type: 'POST',
        success: function (output) {
            var characterNames = output.split("~");
            characterNames = cleanNames(characterNames);
            var dropDown = document.getElementById("characterNames");
            dropDown.options[0] = new Option("", "", true, true);
            for (var index = 0; index < characterNames.length - 1; index++) {
                var item = characterNames[index];
                dropDown.options[index] = new Option(item, item, false, false);
            }
        },
        error: function (error) {
            alert("error! " + error.toString());
        }
    });
}

function cleanNames(characterNames) {
    var cleanedNames = [];
    for (var characterPosition = 0; characterPosition < characterNames.length; characterPosition++) {
        var currentName = characterNames[characterPosition];
        //Strip off the / the file type and the 10 or 12 digit date string
        currentName = currentName.substr(currentName.indexOf('/') + 1);
        currentName = currentName.replace(".char.txt", "");
        currentName = currentName.replace(/\d{12}$/, "");
        currentName = currentName.replace(/\d{10}$/, "");
        if (cleanedNames.indexOf(currentName) < 0) {
            cleanedNames.push(currentName);
        }
    }
    return cleanedNames;
}

function getCharacterRow(table, name) {
    if (table.rows.length > 1) {
        for (var a = 1; a < table.rows.length; a++) {
            if (table.rows[a].cells[0].innerHTML == name) {
                return table.rows[a];
            }
        }
    }
    return null;
}

function loadChar(characterName) {

    //Spin if we are already loading another char
    ajaxCall = true;

    $.ajax({
        url: 'source/load',
        data: {"name": characterName},
        type: 'POST',
        success: function (data) {
            //Need to see if they are already in the table
            var stats = data.split("~");
            if (!tableLoaded) {
                loadTable(stats);
                tableLoaded = true;
            }
            var characterTable = document.getElementById("characterTableBody");
            var row = getRowFromTable(characterTable, characterName);
            for (var a = 0; a < stats.length; a++) {
                row.insertCell(a).innerHTML = stats[a].substring(stats[a].indexOf(":") + 1);
            }
            showAllHidden();
            turnOffColumns();
            ajaxCall = false;
        },
        error: function (error) {
            alert("error! " + error.toString());
            ajaxCall = false;
        }
    });
}

function getRowFromTable(characterTable, characterName) {
    var row = getCharacterRow(characterTable, characterName);
    if (row == null) {
        row = characterTable.insertRow(1);
    } else {
        while (row.cells.length > 0) {
            row.deleteCell(0);
        }
    }
    return row;
}

function showAllHidden() {
    $(':hidden').show();
}

function turnOffColumns() {
    for (var disable = 0; disable < COLUMNS_TO_DISABLE.length; disable++) {
        $('#characterTable td:nth-child(' + COLUMNS_TO_DISABLE[disable] + '), #characterTable th:nth-child(' + COLUMNS_TO_DISABLE[disable] + ')').hide();
    }
}

function loadTable(stats) {
    var table = document.getElementById('characterTable');
    var tHead = table.createTHead();
    var row = tHead.insertRow(0);
    var checkBoxTable = document.getElementById('checkboxTable');
    var checkboxRow = checkBoxTable.insertRow(0);
    for (var headerCount = 0; headerCount < stats.length; headerCount++) {
        var cell = row.insertCell(headerCount);
        var name = stats[headerCount].substr(0, stats[headerCount].indexOf(":"));
        name = capitalizeFirstLetter(name);
        cell.innerHTML = name;
        var checkBoxCell = checkboxRow.insertCell(headerCount % CHECK_BOX_COLUMNS);
        var checked = "checked";
        if (DEFAULT_COLUMNS_OFF.indexOf(name) > -1) {
            checked = "";
            COLUMNS_TO_DISABLE.push(headerCount + 1);
        }
        checkBoxCell.innerHTML = "<input type='checkbox' name='checkbox' value='" + (headerCount + 1) + "' " +
                checked + "/>" + name;
        if ((headerCount + 1) % CHECK_BOX_COLUMNS == 0) {
            checkboxRow = checkBoxTable.insertRow(-1);
        }
    }
    $('#checkBoxForm :checkbox').click(function () {
        var columnIndex = parseInt(this.value);
        if (this.checked) {
            COLUMNS_TO_DISABLE.splice(COLUMNS_TO_DISABLE.indexOf(columnIndex), 1);
            $('#characterTable td:nth-child(' + columnIndex + '), #characterTable th:nth-child(' + columnIndex + ')').show();
        } else {
            if (COLUMNS_TO_DISABLE.indexOf(columnIndex) < 0)
            {
                COLUMNS_TO_DISABLE.push(columnIndex);
            }
            $('#characterTable td:nth-child(' + columnIndex + '), #characterTable th:nth-child(' + columnIndex + ')').hide();
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function reloadTable() {
    var table = document.getElementById("characterTableBody");
    for (var a = 1; a < table.rows.length; a++) {
        loadChar(table.rows[a].cells[0].innerHTML);
    }
}

function change(change, field) {
    var updateElement = document.getElementById(field);
    if (change > 1) {
        change = Number(change) - Number(updateElement.value);
    }
    updateElement.value = Number(updateElement.value) + Number(change);
}

function save() {

    if (document.forms[0].name.value != "") {

        var userData = {};
        var characterForm = document.getElementById("character");
        for (var a = 0; a < characterForm.elements.length; a++) {
            if (characterForm.elements[a].type != "button") {
                userData[characterForm.elements[a].id] = characterForm.elements[a].value;
            }
        }

        $.ajax({
            url: 'source/save',
            data: userData,
            type: 'POST',
            success: function (output) {
                alert(output);
            },
            error: function (error) {
                alert(error);
            }
        });
    } else {
        alert("Enter character name");
    }
}

function load()
{
    if (document.forms[0].name.value != "") {

        $.ajax({
            url: 'source/load',
            data: {"name": document.forms[0].name.value},
            type: 'POST',
            success: function (output) {
                var valueKey = output.split("~");
                valueKey.forEach(setValue);
                alert("Character loaded!");
                socket.emit('login', document.forms[0].name.value);
            },
            error: function (error) {
                alert("error! " + error.toString());
            }
        });
    } else {
        alert("Enter character name");
    }
}

function setValue(element, index, array) {
    var data = element.split(":");
    var update = document.getElementById(data[0]);
    if (update != null) {
        update.value = element.substring(element.indexOf(":") + 1);
    }
}

function saveNotes() {
    if (document.getElementById("adventureName").value != "") {

        var userData = {
            "dmNotes": document.getElementById("dmNotes").value,
            "name": document.getElementById("adventureName").value
        };

        $.ajax({
            url: 'source/saveDm',
            data: userData,
            type: 'POST',
            success: function (output) {
                alert(output);
            },
            error: function (error) {
                alert(error);
            }
        });
    } else {
        alert("Enter adventure name");
    }
}

function loadNotes()
{
    if (document.getElementById("adventureName").value != "") {

        $.ajax({
            url: 'source/loadDm',
            data: {"name": document.getElementById("adventureName").value},
            type: 'POST',
            success: function (output) {
                var valueKey = output.split("~");
                valueKey.forEach(setValue);
                alert("Adventure loaded!");
            },
            error: function (error) {
                alert("error! " + error.toString());
            }
        });
    } else {
        alert("Enter Adventure name");
    }
}

function pushStore() {
    var tableNum = 0;
    var storeContents = [];
    var table = document.getElementById("storeTable" + tableNum);
    while (table != null) {
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
}

function closeStore() {
    socket.emit('dm-storeClose', '');
}

function loadStoreContents(storeContents) {
    var storeCount = 0;
    var tableName = storeContents[0][0];
    var storeTable = buildNewStoreTable(storeCount);
    var rowCount = 0;
    for (var index = 0; index < storeContents.length; index++) {
        if (tableName != storeContents[index][0]) {
            tableName = storeContents[index][0];
            storeCount++;
            storeTable = buildNewStoreTable(storeCount);
            rowCount = 0;
        }
        var row = storeTable.insertRow(rowCount + 1);
        rowCount++;
        row.insertCell(0).innerHTML = storeContents[index][1];
        row.insertCell(1).innerHTML = storeContents[index][2];
        row.insertCell(2).innerHTML = storeContents[index][3];
    }
}

