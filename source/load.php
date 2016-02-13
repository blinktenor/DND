<?php
	$name = $_POST['name'];
	$files = scandir('characters/', SCANDIR_SORT_DESCENDING);
	foreach ($files as $file){
		$pos = strrpos($file, $name);
		if ($pos > -1) {
			$myfile = fopen('characters/' . $file, "r") or die("Unable to open file!");
			echo fread($myfile,filesize('characters/' . $file));
			fclose($myfile);
			break;
		}
    }
?>