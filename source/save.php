<?php

$name = $_POST['name'];
$myfile = fopen('characters/' . $name . date('dmYi') . '.char.txt', "w") or die("Unable to open file!");
fwrite($myfile, 'name:' . $name . '~');
fwrite($myfile, 'class:' . $_POST['class'] . '~');
fwrite($myfile, 'race:' . $_POST['race'] . '~');
fwrite($myfile, 'armor:' . $_POST['armor'] . '~');
fwrite($myfile, 'hp:' . $_POST['hp'] . '~');
fwrite($myfile, 'currentHp:' . $_POST['currentHp'] . '~');
fwrite($myfile, 'level:' . $_POST['level'] . '~');
fwrite($myfile, 'exp:' . $_POST['exp'] . '~');
fwrite($myfile, 'strength:' . $_POST['strength'] . '~');
fwrite($myfile, 'intelligence:' . $_POST['intelligence'] . '~');
fwrite($myfile, 'iMp:' . $_POST['iMp'] . '~');
fwrite($myfile, 'wisdom:' . $_POST['wisdom'] . '~');
fwrite($myfile, 'wMp:' . $_POST['wMp'] . '~');
fwrite($myfile, 'dexterity:' . $_POST['dexterity'] . '~');
fwrite($myfile, 'constitution:' . $_POST['constitution'] . '~');
fwrite($myfile, 'charisma:' . $_POST['charisma'] . '~');
fwrite($myfile, 'primaryWeapon:' . $_POST['primaryWeapon'] . '~');
fwrite($myfile, 'primaryHitBonus:' . $_POST['primaryHitBonus'] . '~');
fwrite($myfile, 'primaryDamage:' . $_POST['primaryDamage'] . '~');
fwrite($myfile, 'secondaryWeapon:' . $_POST['secondaryWeapon'] . '~');
fwrite($myfile, 'secondaryHitBonus:' . $_POST['secondaryHitBonus'] . '~');
fwrite($myfile, 'secondaryDamage:' . $_POST['secondaryDamage'] . '~');
fwrite($myfile, 'platinum:' . $_POST['platinum'] . '~');
fwrite($myfile, 'gold:' . $_POST['gold'] . '~');
fwrite($myfile, 'silver:' . $_POST['silver'] . '~');
fwrite($myfile, 'copper:' . $_POST['copper'] . '~');
fwrite($myfile, 'pack:' . $_POST['pack'] . '~');
fwrite($myfile, 'notes:' . $_POST['notes']);
fclose($myfile);
echo "Character Saved!";
?>