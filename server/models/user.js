/*// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var User = mongoose.model('User', new Schema({ 
    name    : { type:String , unique:true, required:true },
    email   : String,
    password: String, 
    admin   : {type:Boolean , default:false}
}));

module.exports = User;

*/

// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: String,
  password: String
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);