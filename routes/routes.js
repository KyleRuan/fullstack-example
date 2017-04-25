var crypto = require('crypto');
var express = require('express');
var mongoClient = require('../mongo/MongoClient');

var data = [{a : 1}, {a : 2}, {a : 3}]
module.exports = function(app) {
  //获取静态文件,这样就有可以通过 localhost:3030/static/app/js/my_app.js来获取静态资源了
  app.use('/static', express.static( __dirname+'/app'));
  app.get('/', function(req, res){
      mongoClient.insertToCollection(data,function(err,results) {
          console.log(results);
      });
      res.end();
  });

  app.get('/words',function (req,res) {
    require('../mongo/MongoWordClient');
    res.end();
  });

  app.get('/find', function(req, res){
    mongoClient.findAllItems(function (err,items) {
    });

    // 查询有条件
    // mongoClient.findItems({a:1},function (err,items) {
    //
    // });
  });
  app.get('/update', function(req, res){
   mongoClient.updateCollection({a:1},{a:2},function (err,items) {

   })
  });
  app.get('/delete',  function(req, res){
      // delet

    mongoClient.deleteItem({a:1},function (err,results) {
      console.log(results);
    })

  });



}
