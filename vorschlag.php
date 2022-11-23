<?php
$updatedTasks = file_get_contents('php://input');
$suggestionJSON = fopen('JSON/vorschlag.json', 'w');
fwrite($suggestionJSON,$updatedTasks);
fclose($suggestionJSON);

echo "Die Liste aller Vorschläge wurde aktualisiert";
?>