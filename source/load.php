<?php
$name = $_POST['name'];
$myfile = fopen($name . '.char.txt', "r") or die("Unable to open file!");
echo fread($myfile,filesize($name . '.char.txt'));
fclose($myfile);
?>