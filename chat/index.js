/**
 * Created by macspirit on 03.11.16.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
    //res.sendfile('index.html');
    res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(port);