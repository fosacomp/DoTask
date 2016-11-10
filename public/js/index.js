$(document).ready(function () {
    $('.authorization_form').on('submit', function(e) {
        e.preventDefault();

        var login = $("#login").val();
        var pass = $("#pwd").val();

        $.ajax({
            url: consolidatorURI + "/api/oauth/token",
            type: "POST",
            headers: { "Authorization": "Basic " + btoa(login + ":" + pass) },
            contentType: "application/json",
            accepts: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify({ grant_type: "password", username: login, password: pass }),
            error: function(jqXHR) {
                if (jqXHR.responseText)
                    $("#validationInfo").text("Имя пользователя или пароль указаны неверно");
            }
        }).done(function(data) {
            window.localStorage["token"] = "Bearer " + data.access_token;
            window.localStorage["fio"] = data.fio;
            window.localStorage["role"] = data.role;
            window.location.href = consolidatorURI + (data.role == 2 ? "/views/sync" : "/views/manage-users");
        });
    });
});