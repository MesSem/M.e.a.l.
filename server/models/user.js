// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
require('mongoose-type-email');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Address=new Schema({
  street:{type:String},
  city:{type:String, required:true},
  nation:{type:String, required:true},
  CAP:{type:String, required:true}
});

var Card=new Schema({
  number:{type:String, minlength: 16, maxlength: 16, required:true},
  endDate:{type:Date, required:true},
  cvv:{type:String, minlength: 3, maxlength: 4, required:true}
});

var User = new Schema({
  _id: {type: Schema.Types.ObjectId, auto: true},
  username: {type:String, minlength: 6, maxlength: 20, required:true, index: true, unique: true},
  //password: {type:String, required:true}, Creata automaticamente tramite modulo passport
  name: {type:String, required:true},
  surname: {type:String, required:true},
  email: {type:mongoose.SchemaTypes.Email, required:true},
  bornDate: {type:Date, max:Date.now, required:true},
  phoneNumber: String,
  address:  Address,
  cards: [Card],
  idCard: String,
  isAdmin:{type:Boolean, default:false}
});


User.plugin(passportLocalMongoose);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('users', User);