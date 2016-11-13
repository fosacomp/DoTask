var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./libs/db/mysql.js');
var config = require('./config');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

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
var sign = require('./routes/sign');
var index = require('./routes/index');
var homep = require('./routes/homep');
var homec = require('./routes/homec');
var users = require('./routes/users');

var app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 3003;
app.listen(PORT, function () {
  console.log('Example app listening on port 3003!')
});

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
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Привязка маршрутов к путям
app.use('/', index);
app.use('/sign', sign);
app.use('/homep', homep);
app.use('/homec', homec);
app.use('/users', users);

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

module.exports = app;
