/**
 * Created by kyle on 2016/12/2.
 */

/**
 * 创建一个到MongoDB的连接 和启动Express服务器
 * 主程序启动js
 */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var socket = require('socket.io');
// 数据库连接的管理
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session:expressSession});
require('./models/users_model');
var conn =mongoose.connect('mongodb://localhost/myapp');
mongoose.Promise = require('bluebird');
// set template engine
app.engine('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');

//中间件设置
/*app.use(bodyParser.urlencoded({ extended: true }));
扩展选项允许在解析URL编码数据与querystring库（当为false时）或qs库（当为true时）之间进行选择。
 “扩展”语法允许将丰富的对象和数组编码为URL编码格式，允许使用URL编码的类似JSON的体验。*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//将前端和后端分开开发,前端就直接会定位到当前文件夹为静态资源库
app.use(express.static(path.join(__dirname)));

app.use(expressSession({
  secret: 'SECRET',
  cookie: {maxAge:60*60*1000},
  resave:false,
  saveUninitialized: true,
    store: new  mongoStore({
      mongooseConnection: conn.connection,
    collection: 'sessions'
  })
}));


passport.use(new GoogleStrategy({
        clientID: '511777306919-eskth3e3qjkfac69ht7jhq7k7shcmsou.apps.googleusercontent.com',
        clientSecret: '5628FuKahC47VXThVUBKbGvb',
        callbackURL: "http://localhost:3030/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    console.log('gooooooooooooogle');
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));




app.get('/auth/google',
    passport.authenticate('google',
        { scope: ['https://www.googleapis.com/auth/plus.login'] }),function (req,res) {
        console.log(req);
    });


app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
    console.log('...........');
        console.log(req);
     // c
        res.redirect('/');
    });

socket.listen(app).on('connection',function (sockets) {
  sockets.on('message', function (msg) {
    console.log('Message Received: ', msg);
    sockets.broadcast.emit('message', msg);
  });
});
require('./routes/routes')(app);
app.listen(3030);