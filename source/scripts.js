var characterNames;

var DICE_DROPDOWN 			= "diceSides";
var DICE_NUM_OF_ROLLS 		= "numRolls";
var DICE_RESULT_OF_ROLLS	= "result";


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
			var dropDown = document.getElementById("characterNames");
			dropDown.options[0] = new Option ("", "", true, true);
			for (var index = 0; index < characterNames.length - 1; index++) {
				var item = characterNames[index].replace(".char.txt", "");
				dropDown.options[index] = new Option (item, item, false, false);
			}
		},
		error : function (error) {
			alert("error! " + error.toString());
		}
	});
}

function getCharacterRow(table, name) {
	for (var a = 0; a < table.rows.length; a++) {
		if (table.rows[a].cells[0].innerHTML == name) {
			return table.rows[a];
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
			var characterTable = document.getElementById("characterTable");
			var row = getCharacterRow(characterTable, characterName);
			if (row == null) {
				row = characterTable.insertRow(1);
			} else {
				while (row.cells.length > 0) {
					row.deleteCell(0);
				}
			}
			var values = [":" + characterName, stats[3], stats[5], stats[8], stats[9], stats[11], stats[13], stats[14], stats[15]];
			for (var a = 0; a < values.length; a++) {
				row.insertCell(a).innerHTML = values[a].substring(values[a].indexOf(":") + 1);
			}
		},
		error : function (error) {
			alert("error! " + error.toString());
		}
	});
}

function reloadTable() {
	var table = document.getElementById("characterTable");
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