$("#send").on("click", function() {
    var data = {};
    data.artist1 = $("#first").val();
    data.artist2 = $("#second").val();
    $.ajax({
            cache: false,
            type: "POST",
            url: "/similar",
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                console.log("success");
            },
            error: function(xhr, status, error) {
                console.log("fail");
            }
    });        
});