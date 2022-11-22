

let data = [];
$.getJSON('JSON/vorschlag.json', function(result){

    $.each(result.tasks, function(index, val){
        data.push(val);
    });
});

$( "#autoCheck" ).autocomplete({
    source: data,
    autoFocus: true,
    minLength:2,
    Delay: 100
});


// Abfrage ob Local Storage vorhanden ist und die richtigen Inhalte hat
if (localStorage && localStorage.getItem("Not Completed")) {

    // Die Arrays werden mit den Inhalten der Local Storage beschrieben
    let notCompTasksArray = JSON.parse(localStorage.getItem("Not Completed"));
    let compTasksArray = JSON.parse(localStorage.getItem("Completed"));

    // Bestehende Aufgaben werden gelöscht
    $(".notcomp").children("task").remove();
    $(".comp").children("task").remove();

    // Die Inhalte aus der Local Storage werden wieder als Aufgabe eingefügt
    for (let i = 0; i < notCompTasksArray.length; i++) {
        let notCompTasks = $("<div class='task'></div>").text(notCompTasksArray[i]);
        createIcons(notCompTasks);
        $(".notcomp").append(notCompTasks);
    };

    // Die Inhalte aus der Local Storage werden wieder als Aufgabe eingefügt
    for (let i = 0; i < compTasksArray.length; i++) {
        let compTasks = $("<div class='task'></div>").text(compTasksArray[i]);
        createDeleteIcon(compTasks);
        $(".comp").append(compTasks);
    };
};

// Neue Aufgabe wird durch drücken der Enter-Taste hinzugefügt
$(".inputValue").on("keyup", function(e){

    // Die Zahl 13 steht für die Enter Taste
    if (e.keyCode == 13 && $(".inputValue").val() != ""){

        // div-Container wird mit dem Inhalt der Aufgabe erstellt 
        let createTask = $("<div class='task'></div>").text($(".inputValue").val());

        // Check- und Delete Icons werden dem div-Container
        // in der richtigen Reihenfolge hinzugefügt
        createIcons(createTask);

        // Die fertig erstellte Aufgabe wird dem div-Container
        // mit der Klasse ".notcomp" hinzugefügt
        $(".notcomp").append(createTask);

        // Das Eingabefeld wird geleert
        $(".inputValue").val("");

        // Die Local Storage wird durch aufruf der Funktion
        // "addToStorage" aktualisiert
        addToStorage();
    };    
});

// Delete-Icon wird erstellt
function createDeleteIcon(task){

    // Der deleteIcon-Variable wird ein i-Tag mit einem
    // click Event hinzugefügt
    let deleteIcon = $("<i class='fas fa-trash-alt'></i>").click(function(){

        // Die deletedTask-Variable erhält das zu löschende Elternelement
        let deletedTask = $(this).parent();

        // Die Aufgabe wird erst ausgeblendet ...
        deletedTask.fadeOut(function(){

            // ... und dann komplett gelöscht
            deletedTask.remove();

            // Die Local Storage wird nach dem Löschen
            // der Aufgabe aktualisiert
            addToStorage();
        });
    });

    // Das Delete-Icon wird dem div-Tag hinzugefügt
    task.append(deleteIcon);
};

// Check-Icon wird erstellt
function createCheckIcon(task){

    // Der completeIcon-Variable wird ein i-Tag mit einem
    // click Event hinzugefügt
    let completeIcon = $("<i id='check' class='fas fa-check'></i>").click(function(){

        // Die completedTask-Variable erhält das Elternelement
        // des angeklickten Check-Icon's
        let completedTask = $(this).parent();

        // Die Aufgabe wird erst ausgeblendet, ...
        completedTask.fadeOut(function(){

            // ... dem div-Container mit der
            // Klasse ".comp" hinzugefügt ...
            $(".comp").append(completedTask);

            //... und zuletzt wieder eingeblendet
            completedTask.fadeIn();

            // Local Storage nach dem "Erledigt" setzen aktualisieren
            addToStorage();                
        });
        $(this).remove()
    });

    // Das Check-Icon wird dem div-Tag hinzugefügt
    task.append(completeIcon);
};

// Die "createIcons" Funktion fügt die Icons in der
// "richtigen" Reihenfolge ein
function createIcons(task){
    createDeleteIcon(task);
    createCheckIcon(task);
};

// Die "addToStorage" Funktion überschreibt die 
// Local Storage mit der aktuellen Liste
function addToStorage() {

    // Der notCompTasks-Variable werden alle Kinderelemente
    // mit der Klasse .task hinzugefügt
    let notCompTasks = $(".notcomp").children(".task"),

    // Das notCompTasksArray-Array wird erstellt
        notCompTasksArray = [],

    // Der compTasks-Variable werden alle Kinderelemente (mit der Klasse ".task")
    // des Elternelementes (mit der Klasse ".comp") hinzugefügt
        compTasks = $(".comp").children(".task"),

    // Das compTasksArray-Array wird erstellt
        compTasksArray = [];
    
    // Die Textinhalte der notCompTasks-Variable werden
    // dem notCompTasksArray-Array hinzugefügt
    for (let i = 0; i < notCompTasks.length; i++) {
        notCompTasksArray.push(notCompTasks[i].textContent);
    };

    // Die Textinhalte der compTasks-Variable werden
    // dem compTasksArray-Array hinzugefügt
    for (let i = 0; i < compTasks.length; i++) {
        compTasksArray.push(compTasks[i].textContent);
    };

    // Die Local Storage wird mit den Inhalten der Arrays beschrieben
    if (localStorage) {
        localStorage.setItem("Not Completed", JSON.stringify(notCompTasksArray));
        localStorage.setItem("Completed", JSON.stringify(compTasksArray));
    };
};

function blink() {
    if ($('input[type=text]').attr('placeholder')) {
     // get the placeholder text
     $('input[type=text]').attr('placeholder', '');
    } 
    else {
      $('input[type=text]').attr('placeholder', 'Aufgabe Hinzufügen...');
    }
    setTimeout(blink, 1000);
    }
