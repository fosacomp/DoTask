// авторизация
$(function() {
    $("#sign_submit").click(function(){
        var data = { name: $('.sign_form #name').val(), pwd: $('.sign_form #pwd').val() };
        ajax("/sign", "POST", data).done(function(res) {
        	if(res.state)
				window.location.href = "/home";
		});
    });
});

// регистрация
$(function() {
	$("#register_submit").click(function(){
		var data = { role: $('input#client')[0].checked ? 1 : 2,
					 name: $('.register_form #name').val(),
			         pwd: $('.register_form #pwd').val(),
			         email: $('.register_form #email').val()};
		ajax("/register", "POST", data).done(function(res){
			if(res.state){
				$('#register .close').click();
				$('.notify-text').text('На указанный электронный адрес ' + data.email + ' отправлено письмо с ссылкой для активации учетной записи');
				$('#register_notify').modal('show');
			}
		});
	});
});

// очистка форм при закрытии
$('#register').on('hidden.bs.modal', function () {
	$(this).find("input").val('').end();
	$('input#performer').prop('checked', false);
	$('input#client').prop('checked', true);
});
$('#sign').on('hidden.bs.modal', function () {
	$(this).find("input").val('').end();
});

