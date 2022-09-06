var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
database_uri = 'mongodb+srv://admin:admin@casinoghost.0s9watd.mongodb.net/?retryWrites=true&w=majority'

const cors = require("cors");
const corsOptions ={
  origin:'*',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}



const indexRouter = require('./routes/index');
const crashRouter = require('./routes/crash')
const app = express();

// view engine setup
app.use(cors(corsOptions))
app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'html');

app.use(logger('dev')).use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/crash', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
