$.ajax({
    url: 'JSON/vorschlag.json',
    dataType: 'json',
    type: 'get',
    cache: false,
    success: function (data) {
        $(data).each(function (index, value) {
            console.log(value);
        });
        for (let i = 0; i < data.length; i++) {
            let suggestion = "<p>" + data[i] + "</p>";
            $(".suggestions").append(suggestion);
        }
    }
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