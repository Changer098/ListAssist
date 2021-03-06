var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./database/connections').initiate();
require('./database/connections').useRegular();
require('./management/authenticator').init();
require('./management/userManagement').init();

var index = require('./routes/index');
var listPage = require('./routes/listPage');
//var users = require('./routes/users');
var userRoutes = require('./routes/userRouteHandler');
var listRoutes = require('./routes/list');

var app = express();
// view engine setup
require('./util/http-root').setRoot(path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/l/', listPage);
//app.use('/users', users);
app.use('/user', userRoutes);
app.use('/list', listRoutes);

// catch 404 and 404 it
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.render('404', {
    method : req.method,
    path : req.path,
    host : req.hostname,
    headers : JSON.stringify(req.headers),
    ips : req.ips,
    url : req.url
  })
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

process.on('uncaughtException', (err) => {
  console.error("uncaughtException: " + err);
  console.trace();
});

module.exports = app;
