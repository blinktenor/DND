<?php
$name = $_POST['name'];
$myfile = fopen('adventures/' . $name . '.adventure.txt', "w") or die("Unable to open file!");
fwrite($myfile, 'name:' . $name . '~');
fwrite($myfile, 'dmNotes:' . $_POST['dmNotes']);
fclose($myfile);
echo "Adventure Saved!";
?>