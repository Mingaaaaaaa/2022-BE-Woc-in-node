var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressjwt = require("express-jwt");
const secretKey = "Back_End_Woc"
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//配置中间件解析token
//设置哪些接口（如登录，注册接口）不需要token,正则匹配
//配置好解析token中间件后 便可以从req.user中获取用户信息
app.use(
  expressjwt({ secret: secretKey, }).unless({ path: [/^\/login\//, /^\/a\//] })
);
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



//当token 过期后 报错会有err.name==='UnauthorizedError'
//配置错误中间件 写在最后
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError')
    res.send({ state: 401, mesg: "无效token" })

  res.send({ state: 500, mesg: '请联系管理员' })
})
module.exports = app;
