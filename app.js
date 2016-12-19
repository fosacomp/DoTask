var express = require('express');
var path = require('path');
var socketIO = require('socket.io');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./libs/db/mysql.js');
var config = require('./config');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

//var cookie = require('cookie');
//var connect = require('connect');

// options store sessions
var optionsStore = {
    host: config.get('mysql:host'),
    port: config.get('mysql:port'),
    user: config.get('mysql:user'),
    password: config.get('mysql:password'),
    database: config.get('mysql:database'),
    createDatabaseTable: true,
    checkExpirationInterval: 1200000, // How frequently expired sessions will be cleared; milliseconds.
    expiration: 2400000, // The maximum age of a valid session; milliseconds.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'sid',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(optionsStore);

//custom modules
var log = require('./libs/log')(module);

// маршруты UI
var index = require('./routes/index');
var home = require('./routes/home');
var user = require('./routes/user');
var sign = require('./routes/sign');
var register = require('./routes/register');
var logout = require('./routes/logout');
var token = require('./routes/token');

var app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 3000;
// app.listen(PORT, function () {
//   console.log('Example app listening on port 3000!')
// });

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('case sensitive routing', false);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '200kb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup session
var sessionMiddleware = session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    store: sessionStore,
    resave: true,
    saveUninitialized: true
});



app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

// Привязка маршрутов к путям
app.use('/', index);
app.use('/home', home);
app.use('/user', user);
app.use('/register', register);
app.use('/logout', logout.get);
//app.use('/token', token);
app.post('/sign', sign.post);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// db.query('select messages from dotask.messages where id = ?', [40]).then(function (res) {
//   // здесь код будет выполнятся после запроса
//   console.log('Result');
//   console.log(res);
// }).catch(function (err) {
//   // здесь будет сообщение об ошибке
//   console.log('Error');
//   console.log(err);
// });


var io = require('socket.io').listen(app.listen(3000));

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

//io.set('transports', ['websocket']);
// io.use(function(socket, next) {
//     // if(socket.handshake.headers.cookie) {
//     //     socket.cookie = cookie.parse(socket.handshake.headers.cookie);
//     //     sessionID = cookieParser.signedCookie(socket.cookie['connect.sid'], signKey);
//     // }
//     var handshakeData = socket.request;
//
//     // make sure the handshake data looks good as before
//     // if error do this:
//     // next(new Error('not authorized');
//     // else just call next
//     next();
// });

// io.set('authorization', function(handshake, callback) {
//     handshake.cookies = cookie.parse(handshake.headers.cookie || '');
//     var sidCookie = handshake.cookies[config.get('session:key')];
//     var sessionID = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
//
//     if(sidCookie)
//         return callback(null, true);
//     else
//         return callback(null, false);
//
//     //callback(err);
// });

io.on('connection', function(socket){

    if(socket.request.session.userid == 13) {
        socket.on('chat message', function(msg) {
            if(this.session.userid)
                io.emit('chat message', msg);
        }.bind({session:socket.request.session}));
    }
    else
        socket.disconnect();

});

module.exports = app;
