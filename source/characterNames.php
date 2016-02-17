<?php

foreach (glob("characters/*.char.txt") as $filename) {
    echo "$filename~";
}

?>