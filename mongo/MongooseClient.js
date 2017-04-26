/**
 * Created by KyleRuan on 2017/4/25.
 */
var mongoose = require('mongoose');
require('../models/users_model');
var User = mongoose.model('User');
mongoose.connect('mongodb://localhost/Account');

var crypto = require('crypto');
function hashPW(pwd) {
  if (pwd) {
    return crypto.createHash('sha512').update(pwd).digest('base64').toString();
  }

}
mongoose.connection.on('open',function () {
      console.log(mongoose.connection.db);


      var user = new User()
  /**
   *   username:{type:String, unique:true},
   password:String,
   email:String,
   color:String,
   hashed_password:String
   */
  User.saveUser("ruan",hashPW("123456"),"46411@qq.com",function () {
     console.log("save success");
  });
    
     //  user.set("username","kyle1");
     //  user.set("password",hashPW("rk123456789"));
     // user.set('email',"464118236@qq.com");
     // user.save(function (err) {
     //   if(err){
     //     console.log(err);
     //   } else {
     //     console.log("success");
     //   }
     // });
});


function SaveUser() {
  
}