"use strict"

let data = [];
let alreadyExists;
let minLengthAutocomplete = 1;
let positionArrow = 0;
let startSuggestion = 0;
 
$.getJSON('JSON/vorschlag.json', function(result){

    $.each(result.tasks, function(index, val){
        data.push(val);
    });
});

$(".inputValue").on("input",function taskSuggestion(){

    $("#containerSuggestion ul").children(".suggestedTasks").remove();
    $("#containerSuggestion").css("display", "none");

    let inputValue = $(".inputValue").val();

    if(inputValue.length >= minLengthAutocomplete){

        $.each(data, function(val){

            let currentTask = this["value"];

            if(currentTask.toLowerCase().match("^"+inputValue.toLowerCase())){

                let suggestion = $("<li class='suggestedTasks'></li>").text(this["value"]).on("click", function(){
                    $(".inputValue").val(currentTask);
                    $(".inputValue").focus();
                    closeSuggestions();
                });
                openSuggestion(suggestion);
            };
        });
    };
});

function closeSuggestions(){    
    $("#containerSuggestion").css("display", "none");
    $("#containerSuggestion ul").children(".suggestedTasks").remove();
    positionArrow = 0;
};

function openSuggestion(suggestion){
    $("#containerSuggestion ul").append(suggestion);
    $("#containerSuggestion").css("display", "block");
};

$(".inputValue").on("blur", function(){
    if($(".inputValue").val() == ""){
        closeSuggestions();
    };
});

$(window).on("keydown", function suggestionArrowKeys(e){

    if($("#containerSuggestion").css("display") == "block"){

        let suggestionCount = $("#containerSuggestion ul").children(".suggestedTasks").length;

        // Pfeiltaste hoch ist 38
        // Pfeiltaste runter ist 40

        if(e.keyCode == 40){

            if (positionArrow > startSuggestion && positionArrow < suggestionCount){
                
                let previousSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow-1];
                $(previousSuggestion).removeClass("suggestedTasksArrow");

                let currentSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow];
                let currentSuggestionText = $(currentSuggestion).text();
                $(".inputValue").val(currentSuggestionText);
                $(currentSuggestion).addClass("suggestedTasksArrow");
            };
            if (positionArrow == startSuggestion){
                let currentSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow];
                let currentSuggestionText = $(currentSuggestion).text();
                $(currentSuggestion).addClass("suggestedTasksArrow");
                $(".inputValue").val(currentSuggestionText);
            };
            positionArrow++;
        };

        if(e.keyCode == 38){

            if (positionArrow > startSuggestion || positionArrow == startSuggestion){
                
                let previousSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow];
                $(previousSuggestion).removeClass("suggestedTasksArrow");

                let currentSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow-1];
                let currentSuggestionText = $(currentSuggestion).text();
                $(".inputValue").val(currentSuggestionText);
                $(currentSuggestion).addClass("suggestedTasksArrow");
                positionArrow--;
            };
            if (positionArrow < startSuggestion){
                let currentSuggestion = $("#containerSuggestion ul").children(".suggestedTasks")[positionArrow];
                $(currentSuggestion).removeClass("suggestedTasksArrow");
                $(".inputValue").val("");
                positionArrow = 0;
            };
        };
    };
});

function positionSuggestionContainer(){

    // Alle Daten vom input-Tag auf getInputTag schreiben
    let getInputTag = $(".inputValue");

    // Koordinaten vom input-Tag auf positionInputTag schreiben
    let positionsInputTag = getInputTag.position();

    // Gesamthöhe (inkl. padding und border) vom input-Tag
    // auf heightInputTag schreiben
    let heightInputTag = getInputTag.outerHeight();

    // Gesamtbreite (inkl. padding) vom input-Tag
    // auf widthInputTag schreiben
    let widthInputTag = getInputTag.outerWidth();

    // Margin top vom input-Tag auf
    // marginTopInputTag schreiben
    let marginTopInputTag = $(getInputTag).css("marginTop").replace("px","");

    // CSS-Attribute für die Position von containerSuggestion
    // setzen damit containerSuggestion immer unter input-Tag bleibt
    $("#containerSuggestion").css("left", positionsInputTag.left);
    $("#containerSuggestion").css("top", positionsInputTag.top + heightInputTag + marginTopInputTag);
    $("#containerSuggestion").css("width", widthInputTag);
};

$(window).on("resize", function (){    
    positionSuggestionContainer();
})
positionSuggestionContainer();

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

        let inputValue = $(".inputValue").val();

        dataJSON(inputValue);

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

        // Die Liste aller Vorschläge ausblenden und löschen
        closeSuggestions();

        // Die Local Storage wird durch aufruf der Funktion
        // "addToStorage" aktualisiert
        addToStorage();
    };    
});

// Delete-Icon wird erstellt
function createDeleteIcon(task){

    // Der deleteIcon-Variable wird ein i-Tag mit einem
    // click Event hinzugefügt
    let deleteIcon = $("<i id='delete' class='fas fa-trash-alt'></i>").click(function(){

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
      $('input[type=text]').attr('placeholder', 'Aufgabe hinzufügen...');
    }
    setTimeout(blink, 1000);    
};
blink();

function dataJSON(inputValue){
    $.each(data, function(val){

        let task = this["value"];

        if (task == inputValue){
            alreadyExists = "true";
        };
    });
    
    if ( alreadyExists != "true" && inputValue ){

        let newTask = {"value":inputValue};
        data.push(newTask);

        let updateJSON = JSON.stringify({tasks:(data)});

        sendFile(updateJSON);
    };
    alreadyExists = "false";
};

function sendFile(updateJSON) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status !== 200) return;
        console.log(xhr.responseText);
        location.reload();
    };
    xhr.open("POST", "vorschlag.php");
    xhr.send(updateJSON);
};