var characterNames;

var DICE_DROPDOWN 			= "diceSides";
var DICE_NUM_OF_ROLLS 		= "numRolls";
var DICE_RESULT_OF_ROLLS	= "result";

var tableLoaded = false;

var DEFAULT_COLUMNS_OFF = ["Class", "Race", "Level", "Exp", "Pack", "Notes"];

var COLUMNS_TO_DISABLE = [];

var CHECK_BOX_COLUMNS = 10;

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
		url : 'source/characterNames.php',
		data : "",
		type : 'POST',
		success : function (output) {
			var characterNames = output.split("~");
			characterNames = cleanNames(characterNames);
			var dropDown = document.getElementById("characterNames");
			dropDown.options[0] = new Option ("", "", true, true);
			for (var index = 0; index < characterNames.length - 1; index++) {
				var item = characterNames[index];
				dropDown.options[index] = new Option (item, item, false, false);
			}
		},
		error : function (error) {
			alert("error! " + error.toString());
		}
	});
}

function cleanNames(characterNames) {
	var cleanedNames = [];
	for (var characterPosition = 0; characterPosition < characterNames.length; characterPosition++) {
		var currentName = characterNames[characterPosition];
		//Strip off the /
		currentName = currentName.substr(currentName.indexOf('/') + 1);
		currentName = currentName.replace(".char.txt", "");
		//Are the last 10 digits numbers? remove them
		if (currentName.length > 10) {
			var removeNumbers = true;
			for (var check = 1; check < 11; check++) {
				if (isNaN(currentName.substr(currentName.length - check, currentName.length - check + 1))) {
					removeNumbers = false;
				}
			}
			if (removeNumbers) {
				currentName = currentName.substr(0,currentName.length -10);
			}
		}
		if(cleanedNames.indexOf(currentName) < 0) {
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

function loadChar(characterName){
	
	$.ajax({
		url : 'source/load.php',
		data : {"name" : characterName},
		type : 'POST',
		success : function (data) {
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
		},
		error : function (error) {
			alert("error! " + error.toString());
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
		$('#characterTable td:nth-child('+COLUMNS_TO_DISABLE[disable]+'), #characterTable th:nth-child('+COLUMNS_TO_DISABLE[disable]+')').hide();
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
			COLUMNS_TO_DISABLE.push(headerCount+1);
		}
		checkBoxCell.innerHTML = "<input type='checkbox' name='checkbox' value='" + (headerCount+1) + "' " + 
								 checked + "/>" + name;
		if ((headerCount + 1) % CHECK_BOX_COLUMNS == 0) {
			checkboxRow = checkBoxTable.insertRow(-1);
		}
	}
	$('#checkBoxForm :checkbox').click(function() {
		var columnIndex = parseInt(this.value);
		if (this.checked) {
			COLUMNS_TO_DISABLE.splice(COLUMNS_TO_DISABLE.indexOf(columnIndex), 1);
			$('#characterTable td:nth-child('+columnIndex+'), #characterTable th:nth-child('+columnIndex+')').show();
		} else {
			if (COLUMNS_TO_DISABLE.indexOf(columnIndex) < 0)
			{
				COLUMNS_TO_DISABLE.push(columnIndex);	
			}
			$('#characterTable td:nth-child('+columnIndex+'), #characterTable th:nth-child('+columnIndex+')').hide();
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
        for (var a=0; a<characterForm.elements.length; a++) {
		    if (characterForm.elements[a].type != "button") {
		        userData[characterForm.elements[a].id] = characterForm.elements[a].value;
			}
		}
		
		$.ajax({
			url : 'source/save.php',
			data : userData,
			type : 'POST',
			success : function (output) {
				alert(output);
			},
			error : function (error) {
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
			url : 'source/load.php',
			data : {"name" : document.forms[0].name.value},
			type : 'POST',
			success : function (output) {
				alert(output);
				var valueKey = output.split("~");
				valueKey.forEach(setValue); 
				alert("Character loaded!");
			},
			error : function (error) {
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
			"dmNotes" : document.getElementById("dmNotes").value,
			"name" : document.getElementById("adventureName").value
		};
		
		$.ajax({
			url : 'source/saveDm.php',
			data : userData,
			type : 'POST',
			success : function (output) {
				alert(output);
			},
			error : function (error) {
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
			url : 'source/loadDm.php',
			data : {"name" : document.getElementById("adventureName").value},
			type : 'POST',
			success : function (output) {
				var valueKey = output.split("~");
				valueKey.forEach(setValue); 
				alert("Adventure loaded!");
			},
			error : function (error) {
				alert("error! " + error.toString());
			}
		});
	} else {
		alert("Enter Adventure name");
	}
}