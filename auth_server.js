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
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var assert = require('assert');
var client =  new MongoClient(new Server('localhost',27017),{
  socketOptions:{connectTimeoutMS:500},
  poolSize:5,
  auto_reconnect:true
  },
    {numberOfRetries:3,
    retryMillSeconds:500
    }
);


// var MongoClient = require('mongodb').MongoClient
//
// // Connection URL
// var url = 'mongodb://localhost:27017/myproject';
// // Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   console.log("Connected correctly to server");
//
//   db.close();
// });
// 如果数据库有密码的话需要 'mongodb://usename@passworld@localhost:27017/myproject';
var url =  'mongodb://localhost:27017/myproject';

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
};
var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
      , { $set: { b : 1 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
      });
}


client.connect(url,function (err,db) {
  if (err) {
    console.log("Connection Failed Via Client Object");
  } else  {

    insertDocuments(db,function (results) {
     console.log(results);
    })


  }

});

// 数据库连接的管理
// var expressSession = require('express-session');
// var mongoStore = require('connect-mongo')({session:expressSession});
// require('./models/users_model');
// var conn =mongoose.connect('mongodb://localhost/myapp');
// mongoose.Promise = require('bluebird');
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



app.get('/',function (req,res) {
  res.render('/login');
});

// require('./routes/routes')(app);
app.listen(3030);