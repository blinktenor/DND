var characterNames;

var loadedChar;

var DICE_DROPDOWN = "diceSides";
var DICE_NUM_OF_ROLLS = "numRolls";
var DICE_RESULT_OF_ROLLS = "result";

var tableLoaded = false;

var DEFAULT_COLUMNS_OFF = ["Class", "Race", "Level", "Exp", "Hp", "PrimaryWeapon", "PrimaryHitBonus", "PrimaryDamage", "SecondaryWeapon", "SecondaryHitBonus", "SecondaryDamage", "Platinum", "Gold", "Silver", "Copper", "Treasure", "Pack", "Notes", "Spells"];

var COLUMNS_TO_DISABLE = [];

var CHECK_BOX_COLUMNS = 6;

var ITEM_CHANCE_COUNT = [100, 100, 100, 3, 95, 20, 5, 25];

var MAGIC_ITEMS_COUNT_CHANCE = [5, 25];

var MAGIC_ITEM_COST_MODIFIER = [500, 1000, 2000, 8000, 15000];

var socket = io();

var CHARACTER_COLUMNS = [];

function loadModifiers() {
    for (var a = 0; a < 8; a++) {
        if (document.getElementById("mod" + a).value !== "") {
            ITEM_CHANCE_COUNT[a] = document.getElementById("mod" + a).value;
        }
    }
}

function removeCharacterRow(name) {
    var table = document.getElementById("characterTable");
    if (table.rows.length > 1) {
        for (var a = 2; a < table.rows.length; a++) {
            if (table.rows[a].cells[0] !== undefined) {
                if (table.rows[a].cells[0].innerHTML === name) {
                    var row = table.rows[a];
                    while (row.cells.length > 0) {
                        row.deleteCell(0);
                    }
                }
            }
        }
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
        if (a !== 0) {
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
            updateAlert("error! " + error.toString(), 0);
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
    if (table.rows.length > 0) {
        for (var a = 0; a < table.rows.length; a++) {
            if (table.rows[a].cells[0] !== undefined && table.rows[a].cells[0].innerHTML === name) {
                return table.rows[a];
            }
        }
    }
    return null;
}

function loadChar(characterName) {
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
            for (var a = 0; a < stats.length - 1; a++) {
                row.insertCell(a).innerHTML = stats[a].substring(stats[a].indexOf(":") + 1);
            }
            //showAllHidden();
            turnOffColumns();
        },
        error: function (error) {
            updateAlert("error! " + error.toString(), 0);
        }
    });
}

function getRowFromTable(characterTable, characterName) {
    var row = getCharacterRow(characterTable, characterName);
    if (row === null) {
        row = characterTable.insertRow(0);
    } else {
        while (row.cells.length > 0) {
            row.deleteCell(0);
        }
    }
    return row;
}

function showAllHidden() {
    $('#characterTable :hidden').show();
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
    for (var headerCount = 0; headerCount < stats.length - 1; headerCount++) {
        var cell = row.insertCell(headerCount);
        var name = stats[headerCount].substr(0, stats[headerCount].indexOf(":"));
        CHARACTER_COLUMNS.push(name);
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
        if ((headerCount + 1) % CHECK_BOX_COLUMNS === 0) {
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
    $("#checkBoxForm").toggle();
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
    $("#" + field).change();
}

function save() {

    if (document.forms[0].name.value !== "") {

        var userData = {};
        var characterForm = document.getElementById("character");
        for (var a = 0; a < characterForm.elements.length; a++) {
            if (characterForm.elements[a].type !== "button") {
                userData[characterForm.elements[a].id] = characterForm.elements[a].value;
            }
        }

        $.ajax({
            url: 'source/save',
            data: userData,
            type: 'POST',
            success: function (output) {
                updateAlert(output, 1);
            },
            error: function (error) {
                updateAlert(error, 0);
            }
        });
    } else {
        updateAlert("Enter character name", 0);
    }
}

function saveCharacterSheet() {
    if (document.forms[0].name.value !== "") {

        var userData = {};
        $("form#character :input").each(function () {
            var input = $(this);
            userData[input[0].id] = input[0].value;
        });

        $.ajax({
            url: 'source/save',
            data: userData,
            type: 'POST',
            success: function (output) {
                updateAlert(output, 1);
            },
            error: function (error) {
                updateAlert(error, 0);
            }
        });
    } else {
        updateAlert("Enter character name", 0);
    }
}

function load(name)
{
    name = name || document.forms[0].name.value;

    if (name !== "") {

        $.ajax({
            url: 'source/load',
            data: {"name": name},
            type: 'POST',
            success: function (output) {
                var valueKey = output.split("~");
                valueKey.forEach(setValue);
                updateAlert("Character loaded!", 1);
                socket.emit('login', name);
                loadedChar = name;
            },
            error: function (error) {
                updateAlert("error! " + error.toString(), 0);
            }
        });
    } else {
        updateAlert("Enter character name", 0);
    }
}

function setValue(element, index, array) {
    var data = element.split(":");
    var update = document.getElementById(data[0]);
    if (update !== null) {
        update.value = element.substring(element.indexOf(":") + 1);
    }
}

function saveNotes() {
    if (document.getElementById("adventureName").value !== "") {

        var userData = {
            "dmNotes": document.getElementById("dmNotes").value,
            "name": document.getElementById("adventureName").value
        };

        $.ajax({
            url: 'source/saveDm',
            data: userData,
            type: 'POST',
            success: function (output) {
                updateAlert(output, 1);
            },
            error: function (error) {
                updateAlert(error, 0);
            }
        });
    } else {
        updateAlert("Enter adventure name", 0);
    }
}

function loadNotes()
{
    if (document.getElementById("adventureName").value !== "") {

        $.ajax({
            url: 'source/loadDm',
            data: {"name": document.getElementById("adventureName").value},
            type: 'POST',
            success: function (output) {
                var valueKey = output.split("~");
                valueKey.forEach(setValue);
                updateAlert("Adventure loaded!", 1);
            },
            error: function (error) {
                updateAlert("error! " + error.toString(), 0);
            }
        });
    } else {
        updateAlert("Enter Adventure name", 0);
    }
}

function pushStore() {
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
}

function closeStore() {
    socket.emit('dm-storeClose', '');
}

function updateCharacterData(updateData) {
    var row = getCharacterRow(document.getElementById("characterTable"), updateData[0]);
    if (row !== null) {
        row.cells[CHARACTER_COLUMNS.indexOf(updateData[1])].innerHTML = updateData[2];
    }
}

function updateAlert(message, type) {

    document.getElementById("calloutContent").innerHTML = "<p>" + message + "</p>";
    var callout = document.getElementById("callout");
    callout.style.display = "";
    switch (type) {
        case 0:
            callout.className = "alert callout";
            break;
        case 1:
            callout.className = "success callout";
            break;
    }

}