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

var Notification=new Schema({
  message:{type:String, required:true, required:true},
  type: {
      type:String,
      enum: ['GENERAL', 'RECEIVED_TRANSACTION' ,'REFUNDED_FROM_OTHER_PROJECT', 'YOUR_PROJECT_CLOSED', 'YOUR_PROJECT_ACCEPTED', 'YOUR_PROJECT_DECLINED', 'YOUR_PROJECT_PUBLIC'],//YOUR_PROJECT_CLOSED:Project clsoed, site send you all money achieved
      default:'GENERAL'//INDICA UNA TRANSAZIONE CLASSICA
    },
    date:{type:Date,default:Date.now, required:true}
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
  isAdmin:{type:Boolean, default:false},
  notifications:[Notification]
});


User.plugin(passportLocalMongoose);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('users', User);
