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
  //
  //
  //
  // // app.get('/google_login',function (req,res) {
  // //     console.log('goooog');
  // //     if(req.session.user) {
  // //       res.redirect('/');
  // //     }
  // //
  // //     res.render('google_login.html')
  // // });
  //
  //
  //
  //
  //
  // app.get('/logout', function(req, res){
  //   req.session.destroy(function(){
  //     res.redirect('/login');
  //   });
  // });
  //
  //
  // // 从client接收到的网址
  // app.post('/signup', users.signup);
  // app.post('/user/update', users.updateUser);
  // app.post('/user/delete', users.deleteUser);
  // app.post('/login', users.login);
  // app.get('/user/profile', users.getUserProfile);

}
