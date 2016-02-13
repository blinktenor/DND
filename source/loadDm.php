<?php
$name = $_POST['name'];
$myfile = fopen('adventures/' . $name . '.adventure.txt', "r") or die("Unable to open file! " . $name . '.adventure.txt');
echo fread($myfile,filesize('adventures/' . $name . '.adventure.txt'));
fclose($myfile);
?>