// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Loan = new Schema({
  sender:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  projecyRecipient:{type: mongoose.Schema.Types.ObjectId, ref: 'projects', required:true},
  money:{type:Number,required:true},
  date:{type:Date, default:Date.now,required:true},
  notes:String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('loans', Loan);
