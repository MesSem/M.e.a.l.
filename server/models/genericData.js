// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenericData = new Schema({
  _id: {type: Schema.Types.ObjectId, auto: true},
  cacheDateProjectActualMoney:{type:Date, default:Date.now,required:true},
  myId:String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('genericdatas', GenericData);
