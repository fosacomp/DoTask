// авторизация
function getToken() {
    // ajax("/token", "GET").done(function(res) {
    //     if(res.s){
            var socket = io();
            $('form').submit(function(){
                socket.emit('chat message', $('#m').val());
                $('#m').val('');
                return false;
            });
            socket.on('chat message', function(msg){
                $('#messages').append($('<li>').text(msg));
            });
    //     }
    // });
};