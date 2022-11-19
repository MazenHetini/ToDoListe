/*
$.ajax({
    url: 'JSON/vorschlag.json',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function (data) {
        $(data).each(function (index, value) {
            console.log(index, value);
        });
    }
});
*/

let data = [];
$.getJSON('JSON/vorschlag.json', function(result){
    $.each(result, function(index, val){
        data.push(val);
    });
});

$( "#autoCheck" ).autocomplete({
    source: data
});

$(".txtb").on("keyup", function (e) {
    // Die Zahl 13 steht für die Enter Taste
    if (e.keyCode == 13 && $(".txtb").val() != "") {
        var task = $("<div class='task'></div>").text($(".txtb").val());

        var del = $("<i class='fas fa-trash-alt'></i>").click(function () {
            var p = $(this).parent();
            p.fadeOut(function () {
                p.remove();
            });
        });
        var check = $("<i class='fas fa-check'></i>").click(function () {
            var p = $(this).parent();
            p.fadeOut(function () {
                $(".comp").append(p);
                p.fadeIn()
            });
            $(this).remove();
        });
        task.append(del, check);
        $(".notcomp").append(task);
        // Eingabefeld leeren
        $(".txtb").val("");
    }
});