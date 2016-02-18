<?php
	$myfile = fopen("gear.txt", "r") or die("Unable to open file!");
	echo fread($myfile,filesize("gear.txt"));
	fclose($myfile);
?>