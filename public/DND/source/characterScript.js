var socket = io();

socket.on('dm-storeOpen', function (storeContents) {
    loadStoreContents(storeContents);
});

socket.on('dm-storeClose', function (empty) {
    clearStore();
});

/**
 * Preload the character if the user entered the name in the url
 */
$(document).ready(function () {
    var path = document.location.pathname;
    if (path.indexOf('character.html') < 0) {
        load(path.substr(5));
    }
    
    $('#character').change(function (e) {
    if (loadedChar !== null) {
        if ("name" !== e.target.id) {
            socket.emit('player-update', [loadedChar, e.target.id, e.target.value]);
        }
    }
});
});

/**
 * Loads the contents of the store that are pushed out by the DM
 * 
 * @param {type} storeContents
 */
function loadStoreContents(storeContents) {
    document.getElementById("storeDiv").innerHTML = "";
    var storeCount = 0;
    var tableName = storeContents[0][0];
    var storeTable = buildNewStoreTable(storeCount);
    var rowCount = 0;
    for (var index = 0; index < storeContents.length; index++) {
        if (tableName !== storeContents[index][0]) {
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