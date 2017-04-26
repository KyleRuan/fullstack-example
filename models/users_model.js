/**
 * Created by kyle on 2016/12/2.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
  username:{type:String, unique:true},
  email:String,
  color:String,
  hashed_password:String
}); // 如果有第二个参数{collection:'user'} 就会连接到第二个集合上去
// 添加方法
userSchema.methods.saveUser = function (name,password,email,callback) {
  var User = mongoose.model('User');
  var user = new User(
    {
      username:name
    }
  );
  user.set("hashed_password",password);
  user.set("email",email);
    user.save(function (err) {
      if (!err){
         callback()
      }
    })
};
mongoose.model('User',userSchema);