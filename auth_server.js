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
var app = express();


// set template engine
app.engine('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');

var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'rk65328329',
  database: 'test'
};

var connection = mysql.createConnection(options); // or mysql.createPool(options);
var optionsStore = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'rk65328329',
  database: 'test',
  schema: {
    tableName: 'user',
    columnNames: {
      session_id: 'custom_session_id',
      expires: 'custom_expires_column_name',
      data: 'custom_data_column_name'
    }
  }
};
var sessionStore = new MySQLStore(optionsStore);

//中间件设置
/*app.use(bodyParser.urlencoded({ extended: true }));
扩展选项允许在解析URL编码数据与querystring库（当为false时）或qs库（当为true时）之间进行选择。
 “扩展”语法允许将丰富的对象和数组编码为URL编码格式，允许使用URL编码的类似JSON的体验。*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//将前端和后端分开开发,前端就直接会定位到当前文件夹为静态资源库
app.use(express.static(path.join(__dirname)));

connection.connect();

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));


// app.use(expressSession({
//   secret: 'SECRET',
//   cookie: {maxAge:60*60*1000},
//   resave:false,
//   saveUninitialized: true,
//     store: new  mongoStore({
//       mongooseConnection: mysql.connection,
//     collection: 'sessions'
//   })
// }));


require('./routes/routes')(app);
app.listen(3030);