// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({
  sender:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  recipient:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  money:{type:Number,required:true},
  date:{type:Date, default:Date.now,required:true},
  notes:String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('transactions', Transaction);
