var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

//compression
const compression = require("compression")

//helmet
const helmet = require("helmet")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const wiki = require('./routes/wiki')
const catalogRouter = require('./routes/catalog')

const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_CONNECTION_STRING

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

var app = express();

//compress all routes
app.use(compression())

//helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views')); //IMPORTANT! To set the path to point towards the view folder
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wiki', wiki)
app.use('/catalog', catalogRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {

  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
